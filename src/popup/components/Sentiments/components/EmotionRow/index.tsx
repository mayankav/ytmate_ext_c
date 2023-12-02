import React, { useCallback } from "react";
import "./index.scss";
import {
  HappySentimentIcon,
  NeutralSentimentIcon,
  SadSentimentIcon,
} from "../../../../icons";
import { SENTIMENT_ICONS } from "./constants";

interface EmotionRowProps {
  description: string;
  percentage: number;
  type: keyof Sentiments;
}

const EmotionRow = ({ type, percentage, description }: EmotionRowProps) => {
  const getImage = useCallback((type: keyof Sentiments) => {
    switch (type) {
      case "joy":
        return SENTIMENT_ICONS.joy;
      case "surprise":
        return SENTIMENT_ICONS.surprise;
      case "sadness":
        return SENTIMENT_ICONS.sadness;
      case "anger":
        return SENTIMENT_ICONS.anger;
      case "fear":
        return SENTIMENT_ICONS.fear;
      case "love":
        return SENTIMENT_ICONS.love;
    }
  }, []);

  return (
    <div className="emotion_wrapper">
      <div className="icon-wrapper">
        <img src={getImage(type)} alt={type} height="100%" width="100%" />
      </div>
      <div className="emotion_wrapper-inner">
        <div className="percentage">{percentage}%</div>
        <div className="desc">{description}</div>
      </div>
    </div>
  );
};

export default EmotionRow;
