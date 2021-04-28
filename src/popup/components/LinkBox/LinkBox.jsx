import React from 'react';
import backgroundDay from '../../assets/backgroundDay.webp';
import backgroundNight from '../../assets/backgroundNight.webp';
import twitchLogo from '../../assets/twitchLogo.webp';

const currentHour = new Date().getHours();
const isDay = currentHour > 7 && currentHour < 20;
const backgroundImage = isDay ? backgroundDay : backgroundNight;

const LinkBox = ({
  url,
  background = null,
  icon = twitchLogo,
  title = 'Rejoins mon stream ici',
  description,
}) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="h-full flex items-center p-3 min-h-22"
    style={{ backgroundImage: `url(${background || backgroundImage})` }}
  >
    <img src={icon} className="h-12" alt="Icone du live" />
    <div className="flex-grow pl-3 overflow-hidden">
      <p className="text-lg text-shadow truncate">{title}</p>
      {description && (
        <p className="rounded-sm mt-2 p-2 bg-black bg-opacity-40">
          {description}
        </p>
      )}
    </div>
  </a>
);

export default LinkBox;
