import { MessageToPopup } from "../../types";

export function sendMesaageToPopup(
  message: MessageToPopup,
  onResponseCallback: (response: any) => void
) {
  console.log("from bg script to popup", message);
  // Notify the popup that storage has been updated
  chrome.runtime.sendMessage(message, onResponseCallback);
}
