import React, { useEffect, useState } from 'react';

import videoOver from '../../assets/flowers.webm';

import LinkBox from '../LinkBox/LinkBox.jsx';
import Footer from '../Footer/Footer.jsx';
// import Toggle from '../Toggle/Toggle.jsx';

function App() {
  const [{ onair, skins, features }, setLive] = useState({
    onair: false,
    skins: [{}, {}],
    features: [],
  });
  console.log(onair, skins, features);

  const { url, background, icon, title, description } = skins[Number(onair)];

  useEffect(() => {
    if (window.chrome?.storage?.local) {
      window.chrome.storage.local.get(['live'], ({ live }) => setLive(live));
    }
  }, []);

  return (
    <div className="relative flex flex-col overflow-hidden w-96 h-52">
      <div className="absolute z-10 pointer-events-none">
        <video autoPlay muted loop src={videoOver}></video>
      </div>
        <LinkBox
          url={url}
          background={background}
          icon={icon}
          title={title}
          description={description}
        />
      {features.includes('proxy') && (
        <Footer>
          {/* <div className="flex-grow text-center">
            Abonne toi pour écouter les playlists pandora
          </div>
          <Toggle onChange={(x) => x} value={false} /> */}
        </Footer>
      )}
    </div>
  );
}

export default App;
