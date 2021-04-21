import React from 'react';
import backgroundDay from '../../assets/backgroundDay.webp';
import backgroundNight from '../../assets/backgroundNight.webp';
import twitchLogo from '../../assets/twitchLogo.png';

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
    className="flex items-center p-4"
    style={{ backgroundImage: `url(${background || backgroundImage})` }}
  >
    <img src={icon} alt="icone du live" />
    <div className="flex flex-col px-4">
      <p>{title}</p>
      {description && <p>{description}</p>}
    </div>
  </a>
);

export default LinkBox;
