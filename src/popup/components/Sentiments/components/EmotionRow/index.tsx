import React from "react";
import positiveIcon from "../../assets/positive-sentiment.png";
import negativeIcon from "../../assets/negative-sentiment.png";
import neutralIcon from "../../assets/no-sentiment.png";
import "./index.scss";

interface EmotionRowProps {
  description: string;
  percentage: number;
  type: "positive" | "negative" | "neutral";
}

const EmotionRow = ({ type, percentage, description }: EmotionRowProps) => {
  const icon =
    type === "negative"
      ? negativeIcon
      : type === "neutral"
      ? neutralIcon
      : positiveIcon;
  return (
    <div className="emotion_wrapper">
      <img src={icon} alt="Example" height="60px" width="60px" />
      <div className="emotion_wrapper-inner">
        <div className="percentage">{percentage}%</div>
        <div className="desc">{description}</div>
      </div>
    </div>
  );
};

export default EmotionRow;
