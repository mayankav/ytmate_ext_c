import React, { useEffect, useState } from "react";
import { sendMessageToContentScript } from "../helper/sendMessageToContentScript";
import { callFisher } from "../helper/callFisher";
import { checkS3Bucket } from "../helper/checkS3Bucket";
import { Message, MessageTypeEnum } from "../../types";
import Transcript, { TranscriptRecord } from "./Transcript";

const Popup = () => {
  const [transcriptData, setTranscriptData] = useState<Array<TranscriptRecord>>(
    []
  );
  const [commentsData, setCommentsData] = useState([]);
  const [hasCC, setHasCC] = useState(false);
  const checkS3BucketForData = async (directoryName: string) => {
    let contents = await checkS3Bucket(directoryName);
    return contents;
  };
  const [currentTS, setCurrentTS] = useState<number>();
  const [currentVideoId, setCurrentVideoId] = useState<string>();
  const getDataHandler = () => {
    console.log("getDataHandler");
    // get the video id
    const detectVideoId: Message = {
      messageType: MessageTypeEnum.GET_UNIQUE_VIDEO_ID,
    };
    sendMessageToContentScript(detectVideoId, (response) => {
      const videoId = response.uniqueVideoId;
      console.log("videoId", videoId);
      setCurrentVideoId(videoId);
      if (videoId) {
        // check if s3 bucket has the data already (scraping done in past)
        checkS3BucketForData(videoId).then((data) => {
          if (!data) {
            // call fisher to scrape data
            console.log("need to call fisher now..");
            callFisher(videoId).then((data) => {
              setTranscriptData(
                Object.entries(data.transcript.transcriptData).map(
                  ([key, val]) => ({
                    subtitle: val as string,
                    timestamp: parseInt(key),
                  })
                )
              );
              setCommentsData(data.comments);
            });
          } else {
            console.log("s3 bucket has the data already");
            setTranscriptData(
              Object.entries(data.transcript.transcriptData).map(
                ([key, val]) => ({
                  subtitle: val as string,
                  timestamp: parseInt(key),
                })
              )
            );
            setCommentsData(data.comments);
          }
        });
      }
    });
  };
  useEffect(() => {
    // check if video has subtitles
    const ifVideoHasSubtitles: Message = {
      messageType: MessageTypeEnum.HAS_SUBTITLES,
    };
    sendMessageToContentScript(ifVideoHasSubtitles, (response) => {
      if (response.hasSubtitles) {
        setHasCC(true);
      }
    });
  }, []);
  useEffect(() => {
    console.log("commentsData uf", commentsData);
    console.log("transcriptData uf", transcriptData);
  }, [commentsData, transcriptData]);

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

  return (
    <div
      style={{
        width: "320px",
      }}
    >
      {hasCC ? (
        <button onClick={getDataHandler}>Get Data</button>
      ) : (
        "This video does not have subtitles"
      )}
      <Transcript
        transcriptData={transcriptData}
        currentPlayingTimestamp={currentTS}
      />
    </div>
  );
};

export default Popup;
