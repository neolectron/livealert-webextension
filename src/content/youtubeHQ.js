import { youtubeHQApi } from '../config.js';
import messages from '../messages/messages.js';

const getVideoIdFromURL = () => new URLSearchParams(location.search).get('v');

const fetchHQVideoList = async () => {
  const res = await fetch(`${youtubeHQApi.url}${youtubeHQApi.version}/sound`);
  return res.json();
};

const initAudio = () => {
  const audio = document.createElement('audio');
  audio.setAttribute('id', 'youtubeHQ-audio');
  audio.setAttribute('preload', 'metadata');
  audio.setAttribute('muted', true);
  document.body.appendChild(audio);
  return audio;
};

const insertToggle = (onChange) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('youtubeHQ');

  const label = document.createElement('label');
  label.setAttribute('for', 'youtubeHQ-toggle');
  label.innerText = 'YOUTUBE-HQ';
  wrapper.appendChild(label);

  const toggle = document.createElement('input');
  toggle.setAttribute('id', 'youtubeHQ-toggle');
  toggle.setAttribute('type', 'checkbox');
  wrapper.appendChild(toggle);

  const youtubeMenu = document.querySelector(
    'ytd-menu-renderer.ytd-video-primary-info-renderer'
  );

  //FIXME: youtubeMenu is null sometimes.
  console.log('pre insertion:', wrapper);
  console.log('inserting toggle in ', youtubeMenu);
  youtubeMenu.appendChild(wrapper);
  console.log('inserted', youtubeMenu.querySelector('.youtubeHQ'));

  toggle.addEventListener('change', onChange);
  return () => toggle.removeEventListener('change', onChange);
};

const handleToggleChange = ({ target }) => {
  const video = document.querySelector('video');
  const audio = document.querySelector('audio#youtubeHQ-audio');
  const muteBtn = document.querySelector('.ytp-mute-button');

  if (target.checked) {
    !video.muted && muteBtn.click();
    audio.muted = false;
  } else {
    video.muted && muteBtn.click();
    audio.muted = true;
  }
};

const handleStatusChange = (event) => {
  // property list: currentTime, duration, loop, muted, src.
  console.info(event);
};

// please, find a better pattern that properly handle async.
const HQVideoList = [];
fetchHQVideoList().then((json) => {
  HQVideoList.push(...json);
});

const audio = initAudio();

const listenerToClear = [];
chrome.runtime.onMessage.addListener((message) => {
  // stop the music playing ?
  //TODO: listenerToClear has to be cleared at some point
  if (message !== messages.HISTORY_STATE_UPDATED) return;
  const videoID = getVideoIdFromURL();
  if (!HQVideoList.includes(videoID)) return;

  console.info(`"${videoID}" is an enhanced video`);

  const video = document.querySelector('video');

  const clearToggleListener = insertToggle(handleToggleChange);
  listenerToClear.push(clearToggleListener);

  audio.src = `${youtubeHQApi.url}${youtubeHQApi.version}/data/${videoID}.flac`;

  const playVideoListener = [
    'play',
    'pause',
    'waiting',
    'seeking',
    'volumechange',
  ].map((event) => {
    video.addEventListener(event, handleStatusChange);
    return video.removeEventListener(event, handleStatusChange);
  });
  listenerToClear.push(...playVideoListener);
});
