import { livealertApi as api } from '../config.js';
import { setSkin, setCountdown } from '../lib/alertlive.js';
import {
  isAfter,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from 'date-fns';

const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time * 1000));

const poll = async (promiseFn, time) => {
  await promiseFn();
  await sleep(time);
  poll(promiseFn, time);
};

const fetchLive = async () => {
  const url = new URL(`${api.version}${api.path}`, api.url);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      'failed to fetch api',
      `statusCode: ${res.status}`,
      `url: ${api.url}/${api.version}${api.path}`
    );
  }

  return res.json();
};

const handleChange = ({ onair = false, next = 0, skins = [] }) => {
  const now = new Date();
  const nextLive = new Date(next);
  const hasSchedule = isAfter(nextLive, now);
  const isDisplayed = hasSchedule && differenceInHours(nextLive, now) <= 12;
  const isCounted = hasSchedule && differenceInMinutes(nextLive, now) <= 5;

  if (isCounted) {
    setCountdown(differenceInSeconds(nextLive, now));
  }

  return setSkin({
    badgetxt: onair ? 'Live' : 'Off',
    badgecolor: 'dodgerblue',
    badge: onair ? 'icons/128-light.png' : 'icons/128-dark.png',
    ...skins[onair],
    ...(!onair && isDisplayed && { badgetxt: format(nextLive, 'HH:mm') }),
  });
};

// ---------------------------------------------------------------------------

setSkin({
  badgetxt: 'Off',
  badgecolor: 'dodgerblue',
  badge: 'icons/128-dark.png',
});

poll(async () => {
  let offlineTimeout = null;

  try {
    const live = await fetchLive();

    clearTimeout(offlineTimeout);
    offlineTimeout = null;

    chrome.storage.local.set({ live });
    handleChange(live);
  } catch (err) {
    // console.error(err);
    if (offlineTimeout) return;

    console.info(
      "setting the live to off in 5min if the api isn't back online"
    );

    offlineTimeout = setTimeout(() => {
      chrome.storage.local.set({});
      handleChange({});
    }, 300 * 1000);
  }
}, 9);
