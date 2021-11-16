import { useEffect, useState } from 'react';

import VideoOver from '../VideoOver/VideoOver';
import LinkBox from '../LinkBox/LinkBox';
import Footer from '../Footer/Footer';
import Toggle from '../Toggle/Toggle';
import NotifButton from '../NotifButton/NotifButton';

import useProxy from '../../hooks/useProxy';
import useStorage from '../../hooks/useStorage';

import {
  checkUserIsSub,
  getUserDetails,
  initTwitchAuth,
} from '../../utils/twitchApi';

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
    <div className="max-w-100 w-100 relative flex flex-col overflow-hidden font-bold text-white">
      <div className="w-7 h-7 top-2 right-2 absolute flex items-center justify-center">
        <NotifButton
          checked={notif}
          onChange={({ target }) => setNotif(target.checked)}
        />
      </div>
      <VideoOver />
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
            className="flex items-center justify-center flex-grow h-full cursor-pointer"
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
