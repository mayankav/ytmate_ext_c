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
    let interval;
    if (sentimentsData === null) {
      const message: MessageToContentScript = {
        messageType: MessageToContentScriptTypeEnum.GET_UNIQUE_VIDEO_ID,
      };
      sendMessageToContentScript(message, (response) => {
        const videoId = response.uniqueVideoId;
        if (videoId) {
          interval = setInterval(() => {
            checkSentimentsLocally(videoId, (data) => {
              setSentimentsData(data);
            });
          }, 500);
        }
      });
    }
    return () => {
      clearInterval(interval);
    };
  }, [sentimentsData]);

  return sentiments ? (
    <>
      <div className="sentiments-wrapper">
        {sentimentsData &&
          Object.entries(sentimentsData).map(([key, value]) => (
            <EmotionRow
              type={key as keyof Sentiments}
              percentage={value}
              description={key.toString()}
            />
          ))}
      </div>
      <footer>
        <Button variant="secondary" fullWidth iconRight={<AskMeIcon />}>
          Know more with AI?
        </Button>
      </footer>
    </>
  ) : (
    <EmptySentimentScreen onAnalyseClickHandler={onAnalyseClickHandler} />
  );
};

export default Sentiments;
