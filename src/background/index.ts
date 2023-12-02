import { MessageToBgScriptTypeEnum } from "../types";
import { handlePageIconChangeByTab } from "./helper";
import { getTabId } from "./helper/getTabId";
import { getVideoIdFromBgScript } from "./helper/getVideoIdFromBgScript";
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
    case MessageToBgScriptTypeEnum.CALL_AN_API:
      const apiName = request.apiName;
      const source = request.source;
      const question = request.question;
      getVideoIdFromBgScript((videoId) => {
        // sendResponse cannot be called here
        callAnApi({ apiName, vId: videoId, source, question });
      });
      break;
    case "setCurrentTabBusy":
      getTabId((tabId) => {
        setTabBusy(tabId, request.busy);
      });
      sendResponse(`setCurrentTabBusy - ${request.busy}`);
      break;
    case "updateCurrentTimestamp":
      const timestamp = request.timestamp;
      const videoId = request.videoId;
      chrome.storage.local.set({
        lastTimestampByVideoId: {
          timestamp,
          videoId,
        },
      });
      // Send a message to the popup script with the current timestamp
      chrome.tabs.sendMessage(sender.tab.id, { timestamp });
      break;
  }
});

function callAnApi({
  apiName,
  vId,
  source,
  question,
}: {
  apiName: ApiNames;
  vId: string;
  source: ApiSource;
  question?: string;
}) {
  console.log("in call an api", apiName, vId, source);
  try {
    // Dynamically require the module based on apiName
    const apiModule = require(`./api/${apiName}`);
    // Check if the function exists in the imported module
    if (apiModule && apiModule[apiName]) {
      // Call the function with the provided arguments
      if (apiName === "getAnswer") {
        apiModule[apiName](vId, source, question);
      } else {
        apiModule[apiName](vId, source);
      }
    } else {
      console.error(`Function ${apiName} not found in module.`);
    }
  } catch (error) {
    console.error(`Error importing module for ${apiName}:`, error);
  }
}
