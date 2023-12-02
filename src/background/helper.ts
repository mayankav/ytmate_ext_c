import { YOUTUBE_URL } from "./constants";

function setPageIcon(appState: AppState, tabId: number) {
  let path = {
    "16": `icon16_${appState}.png`,
    "32": `icon32_${appState}.png`,
    "48": `icon48_${appState}.png`,
    "64": `icon64_${appState}.png`,
    "128": `icon128_${appState}.png`,
  };
  chrome.action.setIcon({
    path,
    tabId,
  });
}
function handlePageIconChangeByTab(tabUrl: string, tabId: number) {
  if (tabUrl.includes(YOUTUBE_URL)) {
    setPageIcon("active", tabId);
    chrome.action.enable();
  } else {
    setPageIcon("inactive", tabId);
    chrome.action.disable();
  }
}

function handlePageIconChangeByStatus(busy: boolean, tabId: number) {
  if (busy) {
    setPageIcon("busy", tabId);
  } else {
    setPageIcon("active", tabId);
  }
}

export { handlePageIconChangeByTab, handlePageIconChangeByStatus, setPageIcon };
