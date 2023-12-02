import {
  MessageToContentScript,
  MessageToContentScriptReponse,
  MessageToContentScriptTypeEnum,
} from "../types";
import { getUniqueVideoId } from "./helper/getUniqueVideoId";
import { hasSubtitles } from "./helper/hasSubtitles";
import { changeVideoTime } from "./helper/changeVideoTime";
import { callFisher } from "./helper/callFisher";
import { saveDataLocally } from "./helper/saveDataLocally";

export {};

window.onload = (event: Event) => {
  console.log("The webpage is fully loaded");
  var player = document.querySelector("video");
  // Add an event listener to the player's timeupdate event
  if (player) {
    const videoId = getUniqueVideoId();
    // Send a message to the background script with the current timestamp
    const sendTimestampUpdatetoBg = () => {
      const customMessage = {
        action: "updateCurrentTimestamp",
        timestamp: player.currentTime,
        videoId: videoId,
      };
      chrome.runtime.sendMessage(customMessage);
    };
    player.addEventListener("timeupdate", sendTimestampUpdatetoBg);
  }

  // seeking event not updating properly
};

chrome.runtime.sendMessage("I am loading content script", (response) => {
  console.log(response);
  console.log("I am content script");
});

chrome.runtime.onMessage.addListener(
  (
    msg: MessageToContentScript,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: MessageToContentScriptReponse) => void
  ) => {
    // Listening to messages from popup
    // if (sender.origin) { /* Your code here */ }
    console.log("the sender is", sender);
    switch (msg.messageType) {
      case MessageToContentScriptTypeEnum.GET_UNIQUE_VIDEO_ID:
        const videoId = getUniqueVideoId();
        sendResponse({
          uniqueVideoId: videoId,
        });
        break;
      case MessageToContentScriptTypeEnum.HAS_SUBTITLES:
        const hasCC = hasSubtitles();
        sendResponse({
          hasSubtitles: hasCC,
        });
        break;
      case MessageToContentScriptTypeEnum.MOVE_VIDEO_TO_TIME:
        const newTimestamp = msg.timestampInSeconds;
        changeVideoTime(newTimestamp);
        break;
      case MessageToContentScriptTypeEnum.CALL_FISHER:
        const vId = msg.videoId;
        callFisher(vId).then((data) => {
          const tData = Object.entries(data.transcript.transcriptData).map(
            ([key, val]) => ({
              subtitle: val as string,
              timestamp: parseInt(key),
            })
          );
          const cData = data.comments;
          // saving the data locally
          if (tData && cData) {
            saveDataLocally(vId, tData, cData);
          }
          // if popup is closed response wont go, when popup reopens,
          // it should check saved data locally first
          sendResponse({
            tData: tData,
            cData: cData,
          });
        });
        break;
    }
  }
);
