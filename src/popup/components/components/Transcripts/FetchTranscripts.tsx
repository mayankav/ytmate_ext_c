import React, { useEffect, useState } from "react";
import { callFisher } from "../../../helper/callFisher";
import { Message, MessageTypeEnum } from "../../../../types";
import { sendMessageToContentScript } from "../../../helper/sendMessageToContentScript";
import { checkS3Bucket } from "../../../helper/checkS3Bucket";
import { TranscriptRecord } from "../../../types";

interface FetchTranscriptsProps {
  setTranscriptData: React.Dispatch<React.SetStateAction<TranscriptRecord[]>>;
  setCommentsData: React.Dispatch<React.SetStateAction<[]>>;
  setCurrentVideoId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const FetchTranscripts = ({
  setCommentsData,
  setCurrentVideoId,
  setTranscriptData,
}: FetchTranscriptsProps) => {
  const [hasCC, setHasCC] = useState(false);
  const checkS3BucketForData = async (directoryName: string) => {
    let contents = await checkS3Bucket(directoryName);
    return contents;
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

  return hasCC ? (
    <button onClick={getDataHandler}>Get Data</button>
  ) : (
    "This video does not have subtitles"
  );
};

export default FetchTranscripts;
