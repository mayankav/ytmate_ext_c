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
import { checkSummaryLocally } from "../../../background/helper/checkSummaryLocally";
import SummaryBox from "./components/SummaryBox";

const Sentiments = () => {
  // temporary state to toggle between empty and filled sentiment screen
  const [sentiments, setSentiments] = useState(false);
  const [sentimentsData, setSentimentsData] = useState<Sentiments>(null);
  const [videoSummaryData, setVideoSummaryData] = useState();
  const [commentsSummaryData, setCommentsSummaryData] = useState();
  const onAnalyseClickHandler = () => {
    setSentiments(!sentiments);
    const message: MessageToBgScript = {
      action: MessageToBgScriptTypeEnum.CALL_AN_API,
      apiName: ApiNamesEnum.getSentiments,
      source: ApiSourceEnum.none,
    };
    sendMessageToBgScript(message, (response) => {});
  };
  const onSummarizeHandler = () => {
    const commentsSummaryMessage: MessageToBgScript = {
      action: MessageToBgScriptTypeEnum.CALL_AN_API,
      apiName: ApiNamesEnum.getSummary,
      source: "comments",
    };
    sendMessageToBgScript(commentsSummaryMessage, (response) => {});
    const videoSummaryMessage: MessageToBgScript = {
      action: MessageToBgScriptTypeEnum.CALL_AN_API,
      apiName: ApiNamesEnum.getSummary,
      source: "video",
    };
    sendMessageToBgScript(videoSummaryMessage, (response) => {});
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
              } else if (property === "summary") {
                checkSummaryLocally(videoId, "video", (data) => {
                  console.log("PROPS IS summary", data);
                  setVideoSummaryData(data.summary);
                });
                checkSummaryLocally(videoId, "comments", (data) => {
                  setCommentsSummaryData(data.summary);
                });
              }
            }
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    console.log("In Sentiments : commentsSummaryData", commentsSummaryData);
  }, [commentsSummaryData]);

  useEffect(() => {
    console.log("In Sentiments : videoSummaryData", videoSummaryData);
  }, [videoSummaryData]);

  return sentiments ? (
    <>
      <div className="scroll-panel">
        <div className="sentiments-wrapper">
          {sentimentsData &&
            Object.entries(sentimentsData).map(([key, value]) => (
              <EmotionRow
                key={key}
                type={key as keyof Sentiments}
                percentage={value}
                description={key.toString()}
              />
            ))}
        </div>

        {videoSummaryData && (
          <SummaryBox type="Video" summaryText={videoSummaryData} />
        )}
        {commentsSummaryData && (
          <SummaryBox type="Comments" summaryText={commentsSummaryData} />
        )}
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
    <EmptySentimentScreen
      onAnalyseClickHandler={() => {
        onAnalyseClickHandler();
        onSummarizeHandler();
      }}
    />
  );
};

export default Sentiments;
