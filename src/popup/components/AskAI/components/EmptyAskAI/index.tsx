import React from "react";
import Button from "../../../ui-components/button";
import { AskMeIcon, AskMeIconBig } from "../../../../icons";
import CircleIcon from "../../../ui-components/CircleIcon";
import "./index.scss";

interface EmptyAskAiProps {
  generateAnswer: () => void;
}
const EmptyAskAI = ({ generateAnswer }: EmptyAskAiProps) => {
  return (
    <div className="empty-askai-wrapper">
      <div className="icon-wrapper">
        <CircleIcon icon={<AskMeIconBig />} />
      </div>
      <div className="description-container">
        <h3>Ask AI?</h3>
        <p>Instantly uncover video insights. Generate intelligent summaries</p>
      </div>
      <Button iconRight={<AskMeIcon />} onClick={generateAnswer}>
        Generate
      </Button>
    </div>
  );
};

export default EmptyAskAI;
