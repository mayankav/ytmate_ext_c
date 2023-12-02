import React, { useEffect, useState } from "react";
import "./index.scss";
import FetchTranscripts from "./FetchTranscripts";
import ShowTranscript from "./ShowTranscripts";
import { TranscriptRecord } from "../../../types";

const Transcripts = () => {
  // check if transcript exists
  const [transcripts, setTranscripts] = useState(true);
  const [transcriptData, setTranscriptData] = useState<TranscriptRecord[]>([]);
  const [commentsData, setCommentsData] = useState([]);
  const [currentTS, setCurrentTS] = useState<number>();
  const [stopScroll, setStopScroll] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>();

  useEffect(() => {
    if (transcriptData.length && currentVideoId) {
      // update from local storage if available
      chrome.storage.local.get(["lastTimestampByVideoId"], function (result) {
        const videoIdFromLocal = result?.lastTimestampByVideoId?.videoId;
        const lastTimestampFromLocal =
          result?.lastTimestampByVideoId?.timestamp;
        // match with current video id
        if (videoIdFromLocal === currentVideoId && lastTimestampFromLocal) {
          setCurrentTS(lastTimestampFromLocal);
        }
      });
    }

    const updateCurrentVideoTime = function (request: any) {
      setCurrentTS(Math.floor(request.timestamp));
    };
    chrome.runtime.onMessage.addListener(updateCurrentVideoTime);
    return () =>
      chrome.runtime.onMessage.removeListener(updateCurrentVideoTime);
  }, [transcriptData, currentVideoId]);

  useEffect(() => {
    const scrollContainer = document.querySelector(".scroll-wrapper");
    scrollContainer?.addEventListener("scroll", (event) => {
      console.log(event);
      // setStopScroll(true);
    });
  }, []);

  const syncButtonClickHandler = () => {
    setStopScroll(false);
  };

  console.log("transcriptData", transcriptData);
  console.log("commentsData", commentsData);
  console.log("currentTS", currentTS);
  console.log("currentVideoId", currentVideoId);

  return (
    <div className="transcript-container">
      <div className="scroll-wrapper">
        {/* if local then show else show FetchTranscripts */}
        {transcriptData.length === 0 ? (
          <FetchTranscripts
            setCommentsData={setCommentsData}
            setCurrentVideoId={setCurrentVideoId}
            setTranscriptData={setTranscriptData}
          />
        ) : (
          <ShowTranscript
            stopScroll={stopScroll}
            syncButtonClickHandler={syncButtonClickHandler}
            transcriptData={transcriptData}
            currentPlayingTimestamp={currentTS}
          />
        )}
      </div>
    </div>
  );
};

export default Transcripts;
