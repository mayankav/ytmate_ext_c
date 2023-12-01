import React, { useEffect } from "react";
import { sendMessageToContentScript } from "../helper/sendMessageToContentScript";
import { Message, MessageTypeEnum } from "../../types";
interface TranscriptProps {
  transcriptData: Array<TranscriptRecord>;
}
export type TranscriptRecord = {
  subtitle: string;
  timestamp: number;
};
const Transcript = ({ transcriptData }: TranscriptProps) => {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {transcriptData.map((record) => (
        <div
          key={record.timestamp}
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <div
            onClick={() => timeClickHandler(record.timestamp)}
            style={{
              cursor: "pointer",
              color: "blue",
            }}
          >
            {record.timestamp}
          </div>
          <div>{record.subtitle}</div>
        </div>
      ))}
    </div>
  );
};

export default Transcript;
