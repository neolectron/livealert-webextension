import React, { useEffect, useState } from 'react';
import useStorage from '../../hooks/useStorage.js';
import {
  checkUserIsSub,
  getUserDetails,
  initTwitchAuth,
} from '../../utils/twitchApi.js';

import LinkBox from '../LinkBox/LinkBox.jsx';
import Footer from '../Footer/Footer.jsx';
import Toggle from '../Toggle/Toggle.jsx';
import NotifButton from '../NotifButton/NotifButton.jsx';

import videoOver from '../../assets/flowers.webm';
import useProxy from '../../hooks/useProxy.js';

const initialState = {
  onair: false,
  skins: [],
  features: [],
};

function App() {
  const [live] = useStorage('live', 'local', initialState);
  const [user, setUser] = useStorage('user', 'local', false);
  const [notif, setNotif] = useStorage('notif', 'local', false);
  const [proxy, setProxy] = useStorage('proxy', 'local', null);
  const [, setProxyStatus] = useProxy(
    false,
    'pandora.com',
    'proxy.sardoche.tv',
    443
  );
  const [isSub, setIsSub] = useState(false);

  // when logged-in check if sub and set proxy accordingly
  useEffect(() => {
    if (!user) return;

    checkUserIsSub(user.token, user.id).then((subStatus) => {
      if (!subStatus) setProxy(false);
      setIsSub(subStatus);
    });
  }, [user, setProxy]);

  // when the proxy state change is storage, enable/disable the proxy
  useEffect(() => {
    if (proxy === null) return;
    setProxyStatus(proxy);
  }, [proxy, setProxyStatus]);

  const logIn = async () => {
    const token = await initTwitchAuth();
    const userDetails = await getUserDetails(token);
    setUser({ ...userDetails, token });
  };

  console.log('live:', live);
  console.log('notif', notif);
  const { onair, features, skins } = live;
  const currentSkin = skins[Number(onair)] || {};
  const { url, background, icon, title, description } = currentSkin;

  return (
    <div className="overflow-hidden max-w-100 w-100 relative flex flex-col text-white font-bold">
      <div className="absolute flex justify-center items-center w-7 h-7 top-2 right-2">
        <NotifButton
          checked={notif}
          onChange={({ target }) => setNotif(target.checked)}
        />
      </div>
      <div className="absolute z-10 pointer-events-none">
        <video autoPlay muted loop src={videoOver}></video>
      </div>
      <div className="flex-grow">
        <LinkBox
          url={url}
          background={background}
          icon={icon}
          title={title}
          description={description}
        />
      </div>
      {features.includes('proxy') && (
        <Footer className={user ? 'bg-pandorablue' : 'bg-violet'}>
          <a
            className="cursor-pointer h-full flex-grow flex items-center justify-center"
            target="_blank"
            {...(!user && { onClick: logIn })}
            {...(user && !isSub && { href: 'https://subs.twitch.tv/sardoche' })}
            {...(user && isSub && { href: 'https://pandora.com' })}
          >
            {!user ? 'Connecte toi pour écouter les playlists pandora !' : null}
            {user && !isSub
              ? 'Abonne toi pour bénéficier du proxy pandora !'
              : null}
            {user && isSub
              ? 'Écoute mes playlist pandora grace au proxy !'
              : null}
          </a>
          <Toggle
            disabled={!user || !isSub}
            checked={proxy}
            onChange={({ target }) => setProxy(target.checked)}
          />
        </Footer>
      )}
    </div>
  );
}

export default App;
