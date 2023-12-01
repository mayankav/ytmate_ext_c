import { Message, MessageReponse, MessageTypeEnum } from "../types";
import { getUniqueVideoId } from "./helper/getUniqueVideoId";
import { hasSubtitles } from "./helper/hasSubtitles";
import { changeVideoTime } from "./helper/changeVideoTime";

export {};
window.onload = (event: Event) => {
  console.log("The webpage is fully loaded");
  var player = document.querySelector("video");
  // Add an event listener to the player's timeupdate event
  player?.addEventListener("timeupdate", function () {
    // Send a message to the background script with the current timestamp
    chrome.runtime.sendMessage({ timestamp: player.currentTime });
    chrome.storage.local.set({
      lastTimestampByVideoId: {
        timestamp: player.currentTime,
        videoId: getUniqueVideoId(),
      },
    });
  });

  // seeking event not updating properly
};

chrome.runtime.sendMessage("I am loading content script", (response) => {
  console.log(response);
  console.log("I am content script");
});

chrome.runtime.onMessage.addListener(
  (
    msg: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: MessageReponse) => void
  ) => {
    // Listening to messages from popup
    // if (sender.origin) { /* Your code here */ }
    console.log("the sender is", sender);
    switch (msg.messageType) {
      case MessageTypeEnum.GET_UNIQUE_VIDEO_ID:
        const videoId = getUniqueVideoId();
        sendResponse({
          uniqueVideoId: videoId,
        });
        break;
      case MessageTypeEnum.HAS_SUBTITLES:
        const hasCC = hasSubtitles();
        sendResponse({
          hasSubtitles: hasCC,
        });
        break;
      case MessageTypeEnum.MOVE_VIDEO_TO_TIME:
        const newTimestamp = msg.timestampInSeconds;
        changeVideoTime(newTimestamp);
        break;
    }
  }
);
