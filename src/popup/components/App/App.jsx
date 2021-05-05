import React from 'react';
import useStorage from '../../hooks/useStorage.js';

import LinkBox from '../LinkBox/LinkBox.jsx';
import Footer from '../Footer/Footer.jsx';
import Toggle from '../Toggle/Toggle.jsx';

import videoOver from '../../assets/flowers.webm';
const user = false;

const initialState = {
  onair: false,
  skins: [],
  features: [],
};

function App() {
  const [live] = useStorage('live', 'local', initialState);

  console.log('live:', live);
  const { onair, features, skins } = live;
  const currentSkin = skins[Number(onair)] || {};
  const { url, background, icon, title, description } = currentSkin;

  return (
    <div className="overflow-hidden max-w-100 w-100 relative flex flex-col text-white font-bold">
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
        <div className="h-9">
          {!user && (
            <Footer className="bg-violet">
              <div className="flex-grow text-center p-2">
                Connecte toi pour écouter les playlists pandora
              </div>
              <Toggle />
            </Footer>
          )}
          {user && (
            <Footer className="bg-pandorablue">
              <div className="flex-grow text-center p-2">
                Abonne toi pour écouter les playlists pandora
              </div>
              <Toggle />
            </Footer>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
