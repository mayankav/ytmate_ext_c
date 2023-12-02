import {
  MessageToContentScript,
  MessageToContentScriptReponse,
} from "../../types";

export function sendMessageToContentScript(
  message: MessageToContentScript,
  onResponseCallback: (response: MessageToContentScriptReponse) => void
) {
  const params = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(params, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message, {}, onResponseCallback);
  });
}
