import { YOUTUBE_URL } from "./constants";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

function setPageIcon(appState: AppState, tabId: number) {
  let path = {
    "16": `icon16_${appState}.png`,
    "32": `icon32_${appState}.png`,
    "48": `icon48_${appState}.png`,
    "64": `icon64_${appState}.png`,
  };
  chrome.action.setIcon({
    path,
    tabId,
  });
}
function handlePageIconChangeByTab(tabUrl: string, tabId: number) {
  if (tabUrl.includes(YOUTUBE_URL)) {
    setPageIcon("active", tabId);
  } else {
    setPageIcon("inactive", tabId);
  }
  // chrome.storage.local.get("transcriptOwnerTab", (data) => {
  //   const transcriptOwnerTabId =
  //     data.transcriptOwnerTab?.transcriptOwnerTabId;
  //   const transcriptOwnerTabUrl =
  //     data.transcriptOwnerTab?.transcriptOwnerTabUrl;
  //   if (transcriptOwnerTabId && transcriptOwnerTabUrl) {
  //     if (transcriptOwnerTabUrl === tabUrl) {
  //       setPageIcon("green", tabId);
  //     } else {
  //       setPageIcon("yellow", tabId);
  //     }
  //   }
  // });
}
// when you switch to some other tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  chrome.tabs.get(tabId, (tab) => {
    const tabUrl = tab.url;
    tabUrl && handlePageIconChangeByTab(tabUrl, tabId);
  });
});
// when you refresh the same tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const tabUrl = tab.url;
  tabUrl && handlePageIconChangeByTab(tabUrl, tabId);
});
