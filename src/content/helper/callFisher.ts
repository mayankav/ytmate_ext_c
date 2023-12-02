import { MessageToBgScript, MessageToBgScriptTypeEnum } from "../../types";

export async function callFisher(videoId: string) {
  // The aws api gateway is configured with path param i.e. videoId
  const fisherGateway =
    "https://c0i44pv7ka.execute-api.ap-south-1.amazonaws.com/dev";
  const callFisherURL = `${fisherGateway}/${videoId}`;
  try {
    setFisherInProgress(true);
    console.log("fisher called..");
    const response = await fetch(callFisherURL);
    if (!response.ok) {
      setFisherInProgress(false);
      console.log("fisher all end error 1..");
      throw new Error(`callFisher Error! Status: ${response.status}`);
    }
    const data = await response.json();
    setFisherInProgress(false);
    console.log("fisher all end success..");
    trainModel("comments");
    trainModel("video");
    return data;
  } catch (error) {
    console.log("fisher all end error 2..");
    setFisherInProgress(false);
    console.error("callFisher Error:", error.message);
  }
}

function setFisherInProgress(inProgress: boolean) {
  const customMessage = {
    action: "setCurrentTabBusy",
    busy: inProgress,
  };
  // Send the message to the background script
  chrome.runtime.sendMessage(customMessage, (response) => {
    console.log("Received response from background script:", response);
  });
}

function trainModel(type: "video" | "comments") {
  const message: MessageToBgScript = {
    action: MessageToBgScriptTypeEnum.CALL_AN_API,
    apiName: "trainModel",
    source: type,
  };
  // Send the message to the background script
  chrome.runtime.sendMessage(message, (response) => {
    console.log("Received response from background script:", response);
  });
}
