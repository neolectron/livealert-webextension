const {
  setIcon,
  setBadgeText,
  setBadgeBackgroundColor,
} = window.chrome.browserAction;

let hasCountdown = null;
const clearCountdown = () => {
  clearInterval(hasCountdown);
  hasCountdown = null;
};

const setCountdown = (timeLeft) => {
  clearCountdown();
  hasCountdown = setInterval(
    () =>
      timeLeft >= 0 ? setBadgeText({ text: timeLeft-- }) : clearCountdown(),
    1000
  );
};

const setBadge = (badge) => {
  if (badge.startsWith('http')) {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = function () {
      document.body.appendChild(canvas);
      const ctx = canvas.getctx('2d');
      ctx.drawImage(this, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      setIcon({ imageData: imageData });
    };
    img.src = badge;
  } else {
    setIcon({ path: badge });
  }
};

const setSkin = ({ badge, badgetxt, badgecolor }) => {
  !hasCountdown && setBadgeText({ text: badgetxt });
  setBadgeBackgroundColor({ color: badgecolor });
  setBadge(badge);
};

export { setSkin, setCountdown };
