const { identity } = chrome || browser;
import { twitch } from '../../config.js';

const url = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${
  twitch.client_id
}&redirect_uri=${identity.getRedirectURL()}provider_cb&scope=user_read+user_subscriptions+user:read:email`;

const initTwitchAuth = () =>
  new Promise((resolve, reject) => {
    identity.launchWebAuthFlow(
      {
        url,
        interactive: true,
      },
      (redirectURL, err) => {
        if (err) return reject(err);

        resolve(
          new URLSearchParams(redirectURL.split('#')[1]).get('access_token')
        );
      }
    );
  });

const getUserDetails = (token) =>
  fetch('https://api.twitch.tv/helix/users', {
    headers: {
      'Client-ID': twitch.client_id,
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((json) => json.data[0]);

const checkUserIsSub = async (token, userId) => {
  const subscriptions = await fetch(
    `https://api.twitch.tv/kraken/users/${userId}/subscriptions/${twitch.channel_id}`,
    {
      headers: {
        Accept: 'application/vnd.twitchtv.v5+json',
        'Client-ID': twitch.client_id,
        Authorization: `OAuth ${token}`,
      },
    }
  ).then((res) => res.json());

  return Boolean(subscriptions.sub_plan);
};
export { initTwitchAuth, getUserDetails, checkUserIsSub };
