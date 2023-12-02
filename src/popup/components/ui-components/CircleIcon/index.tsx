import React from "react";
import "./index.scss";
import { POPUP_TABS } from "../../../types";
import { AskMeIcon, SentimentIcon, TranscriptIcon } from "../../../icons";

interface CircleIconProps {
  icon: POPUP_TABS;
}

const CircleIcon = ({ icon }: CircleIconProps) => {
  return (
    <div className="circle-container">
      {icon === POPUP_TABS.Transcript && <TranscriptIcon />}
      {icon === POPUP_TABS.Sentiment && <SentimentIcon />}
      {icon === POPUP_TABS.AI && <AskMeIcon />}
    </div>
  );
};

export default CircleIcon;
