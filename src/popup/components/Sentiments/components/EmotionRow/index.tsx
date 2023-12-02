import React, { useCallback } from "react";
import "./index.scss";
import {
  HappySentimentIcon,
  NeutralSentimentIcon,
  SadSentimentIcon,
} from "../../../../icons";
import CircleIcon from "../../../ui-components/CircleIcon";

interface EmotionRowProps {
  description: string;
  percentage: number;
  type: "positive" | "negative" | "neutral";
}

const EmotionRow = ({ type, percentage, description }: EmotionRowProps) => {
  const getIcon = useCallback((type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return <HappySentimentIcon />;
      case "neutral":
        return <NeutralSentimentIcon />;
      case "negative":
        return <SadSentimentIcon />;
    }
  }, []);

  const getGradient = useCallback(
    (type: "positive" | "negative" | "neutral") => {
      switch (type) {
        case "positive":
          return "linear-gradient(180deg, #FBFFFB 0%, #D8FFCA 100%)";
        case "neutral":
          return "linear-gradient(180deg, #FFFDFB 0%, #FFE2B7 100%)";
        case "negative":
          // red color is default gradient
          return;
      }
    },
    []
  );

  return (
    <div className="emotion_wrapper">
      <div className="icon-wrapper">
        <CircleIcon icon={getIcon(type)} colorGradient={getGradient(type)} />
      </div>
      <div className="emotion_wrapper-inner">
        <div className="percentage">{percentage}%</div>
        <div className="desc">{description}</div>
      </div>
    </div>
  );
};

export default EmotionRow;
