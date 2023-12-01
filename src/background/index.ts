import { handlePageIconChangeByTab } from "./helper";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

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
