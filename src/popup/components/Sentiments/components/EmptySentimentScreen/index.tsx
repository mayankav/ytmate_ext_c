import React from "react";
import "./index.scss";
import CircleIcon from "../../../ui-components/CircleIcon";
import { SentimentIconBig, SentimentIconWhite } from "../../../../icons";
import Button from "../../../ui-components/button";

interface EmptySentimentScreenProps {
  onAnalyseClickHandler: () => void;
}
const EmptySentimentScreen = ({
  onAnalyseClickHandler,
}: EmptySentimentScreenProps) => {
  return (
    <div className="empty-sentiments-wrapper">
      <div className="icon-wrapper">
        <CircleIcon icon={<SentimentIconBig />} />
      </div>
      <div className="description-container">
        <h3>Analyse Sentiment</h3>
        <p>
          Discover the world’s best video sentiment analyser and save your time
        </p>
      </div>
      <Button
        iconRight={<SentimentIconWhite />}
        onClick={onAnalyseClickHandler}
      >
        Analyse now
      </Button>
    </div>
  );
};

export default EmptySentimentScreen;
