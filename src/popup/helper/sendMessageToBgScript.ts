import { MessageToBgScript } from "../../types";

export function sendMessageToBgScript(
  message: MessageToBgScript,
  onResponseCallback: (response) => void
) {
  // Send the message to the background script
  chrome.runtime.sendMessage(message, (response) => {
    onResponseCallback(response);
    console.log("Response from background script:", response);
  });
}
