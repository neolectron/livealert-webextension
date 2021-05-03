import { youtubeHQApi } from '../config.js';
import messages from '../messages/messages.js';

/**
 * a Promise that resolve after a specific amount of time
 * @param {Number} ms - The time to wait in ms.
 * @return {Promise} - The promise fullfilled when time is elapsed
 */
const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * get the videoID from url, or undefined if not exists
 * @return {String|undefined} - The videoID if exists.
 */
const getVideoIdFromURL = () => new URLSearchParams(location.search).get('v');

/**
 * get the list of enhanced videos ID.
 * @return {String[]} - a list of enhanced videoIDs.
 */
const fetchHQVideoList = async () => {
  const res = await fetch(`${youtubeHQApi.url}${youtubeHQApi.version}/sound`);
  return res.json();
};

/**
 * Insert the audio Element in the DOM.
 * @return {HTMLElement} - The inserted audio Element
 */
const initAudio = () => {
  const audio = document.createElement('audio');
  audio.muted = true;
  audio.setAttribute('id', 'youtubeHQ-audio');
  audio.setAttribute('preload', 'metadata');
  document.body.appendChild(audio);
  return audio;
};

/**
 * Insert a toggle element and attach eventListeners.
 * @param {Function} onChange - The function fired when the toggle state change.
 * @return {Promise<Function>} - The function to clear eventListeners
 */
const insertToggle = async (onChange) => {
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

  const getMenu = () =>
    document.querySelector('ytd-menu-renderer.ytd-video-primary-info-renderer');

  let youtubeMenu = getMenu();
  while (!youtubeMenu) {
    youtubeMenu = getMenu();
    await wait(700);
  }

  toggle.addEventListener('change', onChange);
  youtubeMenu.insertBefore(
    wrapper,
    youtubeMenu.querySelector('yt-icon-button.dropdown-trigger')
  );

  return () => {
    toggle.removeEventListener('change', onChange);
    youtubeMenu.removeChild(wrapper);
  };
};

/**
 * Mute and unmute the video and audio according to the toggle status
 * @param {Event} - The onChange event attached to the toggle button
 */
const handleToggleChange = ({ target }) => {
  const video = document.querySelector('video');
  const audio = document.querySelector('audio#youtubeHQ-audio');
  const muteBtn = document.querySelector('.ytp-mute-button');

  console.info('toggle switched to', target.checked);
  if (target.checked) {
    !video.muted && muteBtn.click();
    audio.muted = false;
  } else {
    video.muted && muteBtn.click();
    audio.muted = true;
  }
};

/**
 * Enable enhanced audio for the current video.
 * @param {string} videoID - The videoID that should be enhanced.
 * @return {Promise<Function>} - The function to clear eventListeners
 */
const handleStatusChange = (event) => {
  // property list: currentTime, duration, loop, muted, src.
  const video = document.querySelector('video');
  const audio = document.querySelector('audio#youtubeHQ-audio');
  const toggle = document.querySelector('#youtubeHQ-toggle');

  if (event.type === 'volumechange' && toggle.checked && !video.muted) {
    console.info(
      'changed the volume while using youtubeHQ, muting HQ audio',
      video.muted
    );
    toggle.click();
    return;
  }

  video.paused ? audio.pause() : audio.play();
  audio.currentTime = video.currentTime;
};

/**
 * Enable enhanced audio for the current video.
 * @param {string} videoID - The videoID that should be enhanced.
 * @return {Promise<Function>} - The function to clear eventListeners
 */
const enableHQAudioForVideo = async (audio, videoID) => {
  console.info(`"${videoID}" is an enhanced video`);

  const video = document.querySelector('video');

  const clearToggleListener = await insertToggle(handleToggleChange);

  audio.src = `${youtubeHQApi.url}${youtubeHQApi.version}/data/${videoID}.flac`;

  handleStatusChange(new Event('refresh'));
  const clearVideoListeners = [
    'play',
    'pause',
    'waiting',
    'seeking',
    'volumechange',
  ].map((eventName) => {
    video.addEventListener(eventName, handleStatusChange);
    return () => video.removeEventListener(eventName, handleStatusChange);
  });

  return () => {
    clearToggleListener();
    clearVideoListeners.forEach((fn) => fn());
  };
};

// ------------- EXECUTION ----------------
const audioElement = initAudio();
fetchHQVideoList().then(async (HQVideoList) => {
  let clearFunction = null;

  const initialVideoID = getVideoIdFromURL();
  if (HQVideoList.includes(initialVideoID)) {
    clearFunction = await enableHQAudioForVideo(audioElement, initialVideoID);
  }

  chrome.runtime.onMessage.addListener(async (message) => {
    if (message !== messages.HISTORY_STATE_UPDATED) return;
    audioElement.pause();
    audioElement.muted = true;

    if (clearFunction) {
      clearFunction();
      clearFunction = null;
    }

    const videoID = getVideoIdFromURL();
    if (HQVideoList.includes(videoID)) {
      clearFunction = await enableHQAudioForVideo(audioElement, videoID);
    }
  });
});
