import { handlePageIconChangeByTab } from "./helper";
import { getTabId } from "./helper/getTabId";
import { setTabBusy } from "./helper/setTabBusy";

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

// Listen for messages from the content-script or popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action } = request;
  switch (action) {
    case "setCurrentTabBusy":
      getTabId((tabId) => {
        setTabBusy(tabId, request.busy);
      });
      sendResponse(`setCurrentTabBusy - ${request.busy}`);
      break;
    case "updateCurrentTimestamp":
      const timestamp = request.timestamp;
      // Send a message to the popup script with the current timestamp
      chrome.tabs.sendMessage(sender.tab.id, { timestamp });
      break;
  }
});
