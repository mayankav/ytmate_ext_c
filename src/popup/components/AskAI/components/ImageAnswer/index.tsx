import React from "react";
import "./index.scss";
import {
  MessageToContentScript,
  MessageToContentScriptTypeEnum,
} from "../../../../../types";
import { sendMessageToContentScript } from "../../../../helper/sendMessageToContentScript";

interface ImageAnswerProps {
  time: number;
  answer: string;
}
const ImageAnswer = ({ time, answer }: ImageAnswerProps) => {
  const timeClickHandler = () => {
    const changeVideoTime: MessageToContentScript = {
      messageType: MessageToContentScriptTypeEnum.MOVE_VIDEO_TO_TIME,
      timestampInSeconds: time,
    };
    sendMessageToContentScript(changeVideoTime, () => {});
  };
  return (
    <div className="image-ans-wrapper" onClick={timeClickHandler}>
      <div className="image-time">{time}</div>
      <div className="image-answer">{answer}</div>
    </div>
  );
};

export default ImageAnswer;
