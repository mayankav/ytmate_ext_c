import React from "react";
import CircleIcon from "../ui-components/CircleIcon";
import { TranscriptIconBig, TranscriptIconWhite } from "../../icons";
import Button from "../ui-components/button";
import "./index.scss";

interface EmptyTranscriptScreenProps {
  fetchTranscriptHandler: () => void;
  loading: boolean;
  hasCC: boolean;
}
const EmptyTranscriptScreen = ({
  fetchTranscriptHandler,
  loading,
  hasCC,
}: EmptyTranscriptScreenProps) => {
  return (
    <div className="empty-transcript-wrapper">
      <div className="icon-wrapper">
        <CircleIcon icon={<TranscriptIconBig />} />
      </div>
      <div className="description-container">
        <h3>{hasCC ? "See Transcript" : "No Transcript"}</h3>
        <p>
          {hasCC
            ? "Discover the world’s best video transcript and save your time"
            : "This video has no subtitles"}
        </p>
      </div>
      {hasCC && (
        <Button
          iconRight={<TranscriptIconWhite />}
          onClick={fetchTranscriptHandler}
        >
          {loading ? "Loading..." : "See Transcript"}
        </Button>
      )}
    </div>
  );
};

export default EmptyTranscriptScreen;
