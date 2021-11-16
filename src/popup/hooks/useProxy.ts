import { useEffect, useState } from 'react';
const { proxy } = chrome;

// this hook only work in a webextension context.
const useProxy = (initialState, hostname, destURL, destPort) => {
  const [proxyStatus, setProxyStatus] = useState(initialState);

  useEffect(() => {
    const listener = (req) => {
      const url = new URL(req.url);
      const regex = RegExp(`${hostname}\\$`, 'mi');

      if (regex.test(url.hostname)) {
        return { type: 'http', host: destURL, port: destPort };
      }
    };

    //Firefox differs from chrome on how it handles proxy.
    //thus we have to check what browser we're in.
    const enable = () => {
      if (typeof browser !== 'undefined') {
        browser.proxy.onError.addListener((e) => console.log(e));
        return browser.proxy.onRequest.addListener(listener, {
          urls: [`*://*.${hostname}/*`],
        });
      }

      return proxy.settings.set({
        value: {
          mode: 'pac_script',
          pacScript: {
            data: `function FindProxyForURL(url, host) {
                if (shExpMatch(host, "*.${hostname}"))
                  return 'PROXY ${destURL}:${destPort}';
                return 'DIRECT';
              }`,
          },
        },
        scope: 'regular',
      });
    };

    const disable = () => {
      if (typeof browser !== 'undefined') {
        return browser.proxy.onRequest.removeListener(listener);
      }
      proxy.settings.set({ value: { mode: 'direct' }, scope: 'regular' });
    };

    proxyStatus ? enable() : disable();
  }, [proxyStatus, hostname, destURL, destPort]);

  return [proxyStatus, setProxyStatus];
};

export default useProxy;
