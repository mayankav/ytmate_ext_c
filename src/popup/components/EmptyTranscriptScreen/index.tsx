import React from "react";
import CircleIcon from "../ui-components/CircleIcon";
import { TranscriptIconBig, TranscriptIconWhite } from "../../icons";
import Button from "../ui-components/button";
import "./index.scss";

interface EmptyTranscriptScreenProps {
  fetchTranscriptHandler: () => void;
}
const EmptyTranscriptScreen = ({
  fetchTranscriptHandler,
}: EmptyTranscriptScreenProps) => {
  return (
    <div className="empty-transcript-wrapper">
      <div className="icon-wrapper">
        <CircleIcon icon={<TranscriptIconBig />} />
      </div>
      <div className="description-container">
        <h3>See Transcript</h3>
        <p>Discover the world’s best video transcript and save your time</p>
      </div>
      <Button
        iconRight={<TranscriptIconWhite />}
        onClick={fetchTranscriptHandler}
      >
        See Transcript
      </Button>
    </div>
  );
};

export default EmptyTranscriptScreen;
