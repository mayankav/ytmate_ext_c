import React, { useEffect, useState } from "react";
import EmptyAskAI from "./components/EmptyAskAI";
import Button from "../ui-components/button";
import { AskMeIconWhite } from "../../icons";
import "./index.scss";
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
import { sendMessageToBgScript } from "../../helper/sendMessageToBgScript";
import AnswerContainer from "./components/AnswerContainer";
import { sendMessageToContentScript } from "../../helper/sendMessageToContentScript";
import { checkAnswerLocally } from "../../../background/helper/checkAnswerLocally";
import Switch from "./components/Switch";

const AskAI = () => {
  const [promptText, setPromptText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [answerInImage, setAnswerInImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const generateAnswer = () => {
    const message: MessageToBgScript = {
      action: MessageToBgScriptTypeEnum.CALL_AN_API,
      apiName: ApiNamesEnum.getAnswer,
      source: answerInImage ? "images" : ApiSourceEnum.none,
      question: promptText,
    };
    if (promptText.length > 0) {
      setLoading(true);
      sendMessageToBgScript(message, (response) => {
        console.log("response arrived from bg script to askai", response);
      });
    }
  };
  const handlePromptChange = (e) => {
    setPromptText(e.target.value);
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
        if (
          message.messageType === MessageToPopupTypeEnum.STORAGE_UPDATE &&
          message.property === "answer"
        ) {
          const message: MessageToContentScript = {
            messageType: MessageToContentScriptTypeEnum.GET_UNIQUE_VIDEO_ID,
          };
          sendMessageToContentScript(message, (response) => {
            const videoId = response.uniqueVideoId;
            console.log("Message received in popup: videoId", videoId);
            if (videoId) {
              checkAnswerLocally(videoId, (data) => {
                console.log("checked ans locally 444..", promptText);
                setAnswerText(data);
                setPromptText("");
                setLoading(false);
              });
            }
          });
        }
      }
    );
  }, []);

  return (
    <div className="askai-wrapper">
      {answerText.length < 1 ? (
        <EmptyAskAI />
      ) : (
        <AnswerContainer ansText={answerText} />
      )}
      <div className="prompt-text-wrapper">
        <Switch label="scene identification" onToggle={() => {}} />
        <textarea onChange={handlePromptChange} />
      </div>
      <Button iconRight={<AskMeIconWhite />} onClick={generateAnswer}>
        {loading ? "Loading..." : "Generate"}
      </Button>
    </div>
  );
};

export default AskAI;
