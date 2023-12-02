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
  type: keyof Sentiments;
}

const EmotionRow = ({ type, percentage, description }: EmotionRowProps) => {
  const getIcon = useCallback((type: keyof Sentiments) => {
    switch (type) {
      case "joy":
        return <HappySentimentIcon />;
      case "surprise":
        return <NeutralSentimentIcon />;
      case "sadness":
        return <SadSentimentIcon />;
    }
  }, []);

  const getGradient = useCallback((type: keyof Sentiments) => {
    switch (type) {
      case "joy":
        return "linear-gradient(180deg, #FBFFFB 0%, #D8FFCA 100%)";
      case "surprise":
        return "linear-gradient(180deg, #FFFDFB 0%, #FFE2B7 100%)";
      case "sadness":
        // red color is default gradient
        return;
    }
  }, []);

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
