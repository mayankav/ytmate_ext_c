import { Message, MessageReponse } from "../../types";

export function sendMessageToContentScript(
  message: Message,
  onResponseCallback: (response: MessageReponse) => void
) {
  const params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message, {}, onResponseCallback);
  });
}
