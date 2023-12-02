import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { Message, MessageTypeEnum } from "../../types";
import { sendMessageToContentScript } from "../helper/sendMessageToContentScript";
import { convertTimeToMMSS } from "../helper/timeConverter";
import { TranscriptRecord } from "../types";
import Button from "./ui-components/button";

interface ShowTranscriptProps {
  transcriptData: Array<TranscriptRecord>;
  stopScroll: boolean;
  syncButtonClickHandler: () => void;
  currentPlayingTimestamp?: number;
}

const ShowTranscript = ({
  stopScroll,
  syncButtonClickHandler,
  transcriptData,
  currentPlayingTimestamp,
}: ShowTranscriptProps) => {
  const activeDivRef = useRef<HTMLDivElement>(null);
  const timeClickHandler = (timestamp: number) => {
    const changeVideoTime: Message = {
      messageType: MessageTypeEnum.MOVE_VIDEO_TO_TIME,
      timestampInSeconds: timestamp,
    };
    sendMessageToContentScript(changeVideoTime, () => {});
  };

  useEffect(() => {
    console.log("Transcript component", transcriptData);
  }, [transcriptData]);

  const isActive = (owntimestamp: number, nextTimeStamp: number) => {
    if (!currentPlayingTimestamp) {
      return false;
    }
    if (currentPlayingTimestamp >= owntimestamp) {
      if (nextTimeStamp) {
        if (currentPlayingTimestamp < nextTimeStamp) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (activeDivRef.current && !stopScroll) {
      activeDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentPlayingTimestamp, stopScroll]);

  return (
    <div className="transcript-wrapper">
      {stopScroll && (
        <Button className="sync-button" onClick={syncButtonClickHandler}>
          Sync
        </Button>
      )}
      {transcriptData.map((record, i) => {
        const owntimestamp = record.timestamp;
        const nextTimeStamp = transcriptData[i + 1];
        return (
          <div
            key={record.timestamp}
            tabIndex={i}
            className={
              isActive(owntimestamp, nextTimeStamp?.timestamp)
                ? "transcript-row active"
                : "transcript-row inactive"
            }
            ref={
              isActive(owntimestamp, nextTimeStamp?.timestamp)
                ? activeDivRef
                : null
            }
            onClick={() => timeClickHandler(record.timestamp)}
          >
            <div className="transcript-timestamp">
              {convertTimeToMMSS(record.timestamp)}
            </div>
            <div className="transcript-subtitle">{record.subtitle}</div>
            <div className="transcript-bookmark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M11 3C9.927 3 8.67217 4.21642 8 5C7.32783 4.21642 6.073 3 5 3C3.10067 3 2 4.48145 2 6.36694C2 9.5 8 13 8 13C8 13 14 9.5 14 6.5C14 4.61451 12.8993 3 11 3Z"
                  fill="#F5A3A3"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowTranscript;
