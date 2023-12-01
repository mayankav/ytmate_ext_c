import { handlePageIconChangeByTab } from "./helper";

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

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Update the popup with the current timestamp
  // chrome.action.setPopup({
  //   tabId: sender.tab.id,
  //   popup: "popup.html",
  // });

  // Send a message to the popup script with the current timestamp
  chrome.tabs.sendMessage(sender.tab.id, { timestamp: request.timestamp });
});
