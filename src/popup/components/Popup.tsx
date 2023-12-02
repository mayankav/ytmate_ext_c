import React, { useEffect, useState } from "react";
import { sendMessageToContentScript } from "../helper/sendMessageToContentScript";
import { checkS3Bucket } from "../helper/checkS3Bucket";
import { Message, MessageTypeEnum, TranscriptRecord } from "../../types";
import Transcript from "./Transcript";
import { saveDataLocally } from "../helper/saveDataLocally";
import {
  checkDataLocally,
  checkIsModelTrained,
} from "../helper/checkDataLocally";
import { handlePageIconChangeByStatus } from "../../background/helper";
import { getTabId } from "../helper/getTabId";
import { trainModel } from "../api/trainModel";
import { saveTrainingStatusLocally } from "../helper/saveTrainingStatusLocally";

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
  const [currentTabId, setCurrentTabId] = useState<number>();
  const [loading, setLoading] = useState(false);

  const getDataHandler = () => {
    console.log("getDataHandler");
    setLoading(true);
    // check currentVideoId
    if (currentVideoId) {
      // check if s3 bucket has the data already (scraping done in past)
      checkS3BucketForData(currentVideoId).then((data) => {
        if (!data) {
          // call fisher to scrape data
          console.log("need to call fisher now..");
          const fisherRequest: Message = {
            messageType: MessageTypeEnum.CALL_FISHER,
            videoId: currentVideoId,
          };
          sendMessageToContentScript(fisherRequest, (response) => {
            if (response) {
              const { tData, cData } = response;
              if (tData) {
                setTranscriptData(tData);
              }
              if (cData) {
                setCommentsData(cData);
              }
            }
          });
        } else {
          console.log("s3 bucket has the data already");
          const tData = Object.entries(data.transcript.transcriptData).map(
            ([key, val]) => ({
              subtitle: val as string,
              timestamp: parseInt(key),
            })
          );
          const cData = data.comments;
          saveDataLocally(currentVideoId, tData, cData);
          setTranscriptData(tData);
          setCommentsData(cData);
        }
      });
    }
  };
  useEffect(() => {
    // check if video has subtitles
    const ifVideoHasSubtitles: Message = {
      messageType: MessageTypeEnum.HAS_SUBTITLES,
    };
    sendMessageToContentScript(ifVideoHasSubtitles, (response) => {
      console.log("checking if video has subtitles..");
      if (response?.hasSubtitles) {
        setHasCC(true);
      } else {
        setHasCC(false);
      }
    });
  }, []);

  useEffect(() => {
    // get the video id
    const detectVideoId: Message = {
      messageType: MessageTypeEnum.GET_UNIQUE_VIDEO_ID,
    };
    sendMessageToContentScript(detectVideoId, (response) => {
      const videoId = response?.uniqueVideoId;
      if (videoId) {
        checkDataLocally(videoId, (tData, cData) => {
          if (tData) setTranscriptData(tData);
          if (cData) setCommentsData(cData);
        });
        setCurrentVideoId(videoId);
      }
    });
  }, []);

  useEffect(() => {
    getTabId((tabId) => {
      setCurrentTabId(tabId);
      handlePageIconChangeByStatus(loading, tabId);
    });
  }, [loading]);

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
    if (currentVideoId) {
      checkIsModelTrained(currentVideoId, (isModelTrained) => {
        if (isModelTrained) {
          console.log("model is already trained");
        } else if (currentVideoId) {
          console.log("Model is not trained...", "retrying..");
          if (transcriptData.length > 0) {
            trainModel(currentVideoId, "video")
              .then((response) => {
                console.log("Video Training Success:", response.status);
                saveTrainingStatusLocally(currentVideoId, true);
              })
              .catch((error) => {
                console.error("Video Training Error:", error);
                saveTrainingStatusLocally(currentVideoId, false);
              });
          }
          if (commentsData.length > 0) {
            trainModel(currentVideoId, "comments")
              .then((response) => {
                console.log("Comments Training Success", response.status);
                saveTrainingStatusLocally(currentVideoId, true);
              })
              .catch((error) => {
                console.error("Comments Training Error:", error);
                saveTrainingStatusLocally(currentVideoId, false);
              });
          }
        }
      });
    }
  }, [commentsData, transcriptData, currentVideoId]);

  return (
    <div
      style={{
        width: "320px",
      }}
    >
      {loading
        ? "Loading...."
        : hasCC &&
          transcriptData.length < 1 && (
            <button onClick={getDataHandler}>Get Data</button>
          )}
      {!hasCC && "This video does not have subtitles"}
      <Transcript
        transcriptData={transcriptData}
        currentPlayingTimestamp={currentTS}
      />
    </div>
  );
};

export default Popup;
