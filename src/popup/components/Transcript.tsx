import React, { useEffect, useRef } from "react";
import { sendMessageToContentScript } from "../helper/sendMessageToContentScript";
import { Message, MessageTypeEnum } from "../../types";
import { convertTimeToMMSS } from "../helper/timeConverter";
import "./index.scss";
interface TranscriptProps {
  transcriptData: Array<TranscriptRecord>;
  currentPlayingTimestamp?: number;
}
export type TranscriptRecord = {
  subtitle: string;
  timestamp: number;
};
const Transcript = ({
  transcriptData,
  currentPlayingTimestamp,
}: TranscriptProps) => {
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
        if (currentPlayingTimestamp <= nextTimeStamp) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (activeDivRef.current) {
      activeDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentPlayingTimestamp]);

  return (
    <div className="transcript-container">
      {transcriptData.map((record, i) => {
        const owntimestamp = record.timestamp;
        const nextTimeStamp = transcriptData[i + 1];
        return (
          <div
            key={record.timestamp}
            tabIndex={i}
            className={
              isActive(owntimestamp, nextTimeStamp?.timestamp)
                ? "row active"
                : "row inactive"
            }
            ref={
              isActive(owntimestamp, nextTimeStamp?.timestamp)
                ? activeDivRef
                : null
            }
            onClick={() => timeClickHandler(record.timestamp)}
          >
            <div
              style={{
                color: "blue",
              }}
            >
              {convertTimeToMMSS(record.timestamp)}
            </div>
            <div className="subtitle">{record.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Transcript;
