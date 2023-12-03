import React, { useState, useEffect } from "react";
import EmotionRow from "./components/EmotionRow";
import "./index.scss";
import Button from "../ui-components/button";
import { AskMeIcon } from "../../icons";
import EmptySentimentScreen from "./components/EmptySentimentScreen";
import { sendMessageToBgScript } from "../../helper/sendMessageToBgScript";
import { sendMessageToContentScript } from "../../helper/sendMessageToContentScript";
import {
  ApiNamesEnum,
  ApiSourceEnum,
  MessageToBgScript,
  MessageToBgScriptTypeEnum,
  MessageToContentScript,
  MessageToContentScriptTypeEnum,
  MessageToPopup,
  MessageToPopupTypeEnum,
} from "../../../types";
import { checkSentimentsLocally } from "../../../background/helper/checkSentimentsLocally";

const Sentiments = () => {
  // temporary state to toggle between empty and filled sentiment screen
  const [sentiments, setSentiments] = useState(false);
  const [sentimentsData, setSentimentsData] = useState<Sentiments>(null);
  const onAnalyseClickHandler = () => {
    setSentiments(!sentiments);
    const message: MessageToBgScript = {
      action: MessageToBgScriptTypeEnum.CALL_AN_API,
      apiName: ApiNamesEnum.getSentiments,
      source: ApiSourceEnum.none,
    };
    sendMessageToBgScript(message, (response) => {});
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (message: MessageToPopup, sender, sendResponse) => {
        // Handle the received message from the background script
        console.log(
          "Message received in popup:",
          message.messageType,
          message.property
        );
        if (message.messageType === MessageToPopupTypeEnum.STORAGE_UPDATE) {
          const property = message.property;
          const msg: MessageToContentScript = {
            messageType: MessageToContentScriptTypeEnum.GET_UNIQUE_VIDEO_ID,
          };
          sendMessageToContentScript(msg, (response) => {
            const videoId = response.uniqueVideoId;
            console.log("Message received in popup: videoId", videoId);
            if (videoId) {
              if (property === "sentiments") {
                checkSentimentsLocally(videoId, (data) => {
                  console.log("PROPS IS sentiments", data);
                  setSentimentsData(data);
                });
              }
            }
          });
        }
      }
    );
  }, []);

  return sentiments ? (
    <>
      <div className="sentiments-wrapper">
        {sentimentsData &&
          Object.entries(sentimentsData).map(([key, value]) => (
            <EmotionRow
              type={key as keyof Sentiments}
              percentage={Math.round(value)}
              description={key.toString()}
            />
          ))}
      </div>
      <footer>
        <Button
          variant="secondary"
          fullWidth
          iconRight={<AskMeIcon />}
          onClick={() => {}}
        >
          Try more with AI
        </Button>
      </footer>
    </>
  ) : (
    <EmptySentimentScreen onAnalyseClickHandler={onAnalyseClickHandler} />
  );
};

export default Sentiments;
