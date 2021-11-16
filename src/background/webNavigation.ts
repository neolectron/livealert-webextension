import messages from '../messages/messages.js';

chrome.webNavigation.onHistoryStateUpdated.addListener(
  ({ tabId }) => {
    chrome.tabs.sendMessage(tabId, messages.HISTORY_STATE_UPDATED);
  },
  {
    url: [{ hostContains: 'youtube.com' }],
  }
);
