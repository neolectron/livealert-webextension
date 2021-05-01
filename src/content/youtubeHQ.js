import { youtubeHQApi } from "../config.js";

const disableYoutubeHQ = () =>
  document.querySelector("audio#youtubeHQ-audio")?.pause();

const enableYoutubeHQ = () => {
  const video = document.querySelector("video");
  const audio = document.querySelector("audio#youtubeHQ-audio");

  const syncTime = ({ target }) => {
    console.info(target);
    console.info(
      "currentTime video - audio :",
      video.currentTime,
      audio.currentTime
    );
    audio.currentTime = video.currentTime;
    audio.play();
  };

  video.addEventListener("playing", syncTime);

  return () => {
    video.removeEventListener("playing", syncTime);
  };
};

const handleChange = ({ target }) => {
  const video = document.querySelector("video");
  const audio = document.querySelector("audio#youtubeHQ-audio");
  const muteBtn = document.querySelector(".ytp-mute-button");

  if (target.checked) {
    !video.muted && muteBtn.click();
    audio.muted = false;
  } else {
    video.muted && muteBtn.click();
    audio.muted = true;
  }
};

const insertToggle = (parentElement) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("youtubeHQ");

  const label = document.createElement("label");
  label.setAttribute("for", "youtubeHQ-toggle");
  label.innerText = "YOUTUBE-HQ";
  wrapper.appendChild(label);

  const toggle = document.createElement("input");
  toggle.setAttribute("id", "youtubeHQ-toggle");
  toggle.setAttribute("type", "checkbox");
  toggle.addEventListener("change", handleChange);
  wrapper.appendChild(toggle);

  const audio = document.createElement("audio");
  const videoID = new URLSearchParams(location.search).get("v");
  audio.setAttribute("id", "youtubeHQ-audio");
  audio.setAttribute("preload", "metadata");
  audio.setAttribute("muted", true);
  audio.setAttribute(
    "src",
    `${youtubeHQApi.url}${youtubeHQApi.version}/data/${videoID}.flac`
  );

  console.info("inserting audio markup");
  console.info("inserting youtubeHQ button");
  document.body.appendChild(audio);
  parentElement.appendChild(wrapper);

  return () => toggle.removeEventListener("change", handleChange);
};

// INIT
(async () => {
  console.info("init");
  const removeListenerList = [];
  // Get all the asmr video list
  const enhancedVideoList = await fetch(
    `${youtubeHQApi.url}${youtubeHQApi.version}/sound`
  ).then((res) => res.json());

  // a derivated solution inspired by (because his doesn't work)
  // https://stackoverflow.com/questions/18397962/chrome-extension-is-not-loading-on-browser-navigation-at-youtube/18398921#18398921
  (document.body || document.documentElement).addEventListener(
    "transitionend",
    () => {
      console.info("transitionend");

      if (
        !enhancedVideoList.includes(
          new URLSearchParams(location.search).get("v")
        )
      )
        return;
      console.info("url is an asmr url");

      const buttonMenu = document.querySelector(
        "ytd-menu-renderer.ytd-video-primary-info-renderer #top-level-buttons"
      );
      if (!buttonMenu || buttonMenu.querySelector(".youtubeHQ")) return;
      console.info("menu is present on the page");

      removeListenerList.forEach((removeListener) => removeListener());

      removeListenerList.push(insertToggle(buttonMenu));
      removeListenerList.push(enableYoutubeHQ());
    },
    true
  );
})();
