import React from "react";
import { AskMeIconBig } from "../../../../icons";
import CircleIcon from "../../../ui-components/CircleIcon";
import "./index.scss";

const EmptyAskAI = () => {
  return (
    <div className="empty-askai-wrapper">
      <div className="icon-wrapper">
        <CircleIcon icon={<AskMeIconBig />} />
      </div>
      <div className="description-container">
        <h3>Ask AI?</h3>
        <p>Generate intelligent summaries & uncover video insights.</p>
      </div>
    </div>
  );
};

export default EmptyAskAI;
