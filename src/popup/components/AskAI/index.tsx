import React, { useEffect, useState } from "react";
import EmptyAskAI from "./components/EmptyAskAI";
import Button from "../ui-components/button";
import { AskMeIconWhite, AskMeIconBig } from "../../icons";
import "./index.scss";
import {
  ApiNamesEnum,
  ApiSourceEnum,
  MessageToBgScript,
  MessageToBgScriptTypeEnum,
  MessageToContentScript,
  MessageToContentScriptTypeEnum,
} from "../../../types";
import { sendMessageToBgScript } from "../../helper/sendMessageToBgScript";
import AnswerContainer from "./components/AnswerContainer";
import { sendMessageToContentScript } from "../../helper/sendMessageToContentScript";
import { checkAnswerLocally } from "../../../background/helper/checkAnswerLocally";

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
      sendMessageToBgScript(message, (response) => {});
    }
  };
  const handlePromptChange = (e) => {
    setPromptText(e.target.value);
  };

  useEffect(() => {
    let interval;
    if (answerText.length < 1 || loading) {
      const message: MessageToContentScript = {
        messageType: MessageToContentScriptTypeEnum.GET_UNIQUE_VIDEO_ID,
      };
      sendMessageToContentScript(message, (response) => {
        const videoId = response.uniqueVideoId;
        if (videoId) {
          interval = setInterval(() => {
            checkAnswerLocally(videoId, (data) => {
              console.log("checked ans locally..");
              setAnswerText(data);
              setLoading(false);
            });
          }, 500);
        }
      });
    }
    return () => {
      clearInterval(interval);
    };
  }, [answerText]);

  return (
    <div className="askai-wrapper">
      {answerText.length < 1 ? (
        <EmptyAskAI />
      ) : (
        <AnswerContainer ansText={answerText} />
      )}
      <textarea onChange={handlePromptChange} />
      <Button iconRight={<AskMeIconWhite />} onClick={generateAnswer}>
        {loading ? "Loading..." : "Generate"}
      </Button>
    </div>
  );
};

export default AskAI;
