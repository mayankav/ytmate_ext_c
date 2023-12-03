import React, { useEffect, useState } from "react";
import { sendMessageToContentScript } from "../helper/sendMessageToContentScript";
import { checkS3Bucket } from "../helper/checkS3Bucket";
import {
  MessageToContentScript,
  MessageToContentScriptTypeEnum,
  TranscriptRecord,
  MessageToBgScript,
  MessageToBgScriptTypeEnum,
} from "../../types";
import ShowTranscripts from "./ShowTranscripts";
import { saveDataLocally } from "../helper/saveDataLocally";
import {
  checkDataLocally,
  checkIsModelTrained,
} from "../helper/checkDataLocally";
import { getTabId } from "../helper/getTabId";
import { checkIsTabBusy } from "../helper/setTabBusy";
import Button from "./ui-components/button";
import { DownloadIcon } from "../icons";
import { sendMessageToBgScript } from "../helper/sendMessageToBgScript";
import EmptyTranscriptScreen from "./EmptyTranscriptScreen";
import { convertTimeToMMSS } from "../helper/timeConverter";
import SearchBox from "./Searchbox";

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
  const [stopScroll, setStopScroll] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filteredTranscriptData, setFilteredTranscriptData] =
    useState<TranscriptRecord[]>();

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
          const fisherRequest: MessageToContentScript = {
            messageType: MessageToContentScriptTypeEnum.CALL_FISHER,
            videoId: currentVideoId,
          };
          sendMessageToContentScript(fisherRequest, (response) => {
            if (response) {
              const { tData, cData } = response;
              console.log("response from cs", response);
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
    const ifVideoHasSubtitles: MessageToContentScript = {
      messageType: MessageToContentScriptTypeEnum.HAS_SUBTITLES,
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
    // get the tab id
    getTabId((tabId) => {
      setCurrentTabId(tabId);
    });
    // get the video id
    const detectVideoId: MessageToContentScript = {
      messageType: MessageToContentScriptTypeEnum.GET_UNIQUE_VIDEO_ID,
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
    let interval;
    if (currentTabId) {
      interval = setInterval(() => {
        checkIsTabBusy(currentTabId, (isBusy) => {
          setLoading(isBusy);
        });
      }, 500);
      checkIsTabBusy(currentTabId, (isBusy) => {
        setLoading(isBusy);
      });
    }
    () => {
      clearInterval(interval);
    };
  }, [currentTabId]);

  useEffect(() => {
    console.log("transcript changed...", transcriptData);
  }, [transcriptData]);

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

  // training the model through bg script
  useEffect(() => {
    if (currentVideoId) {
      checkIsModelTrained(currentVideoId, (isModelTrained) => {
        if (!isModelTrained) {
          if (commentsData.length > 0) {
            const message: MessageToBgScript = {
              action: MessageToBgScriptTypeEnum.CALL_AN_API,
              apiName: "trainModel",
              source: "comments",
            };
            sendMessageToBgScript(message, (res) => {});
          }
          if (transcriptData.length > 0) {
            const message: MessageToBgScript = {
              action: MessageToBgScriptTypeEnum.CALL_AN_API,
              apiName: "trainModel",
              source: "video",
            };
            sendMessageToBgScript(message, (res) => {});
          }
        }
      });
    }
  }, [commentsData, transcriptData, currentVideoId]);

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

  const handleBookMarkSave = (timeStamp: number) => {
    chrome.storage.local.set({
      bookmark: {
        timeStamp: timeStamp,
        videoId: currentVideoId,
      },
    });
  };

  const onDownloadTranscriptHandler = () => {
    // download transcript from transcriptData
    if (!transcriptData.length) return;
    const fileName = "transcript.txt";
    const text = transcriptData
      .map(
        (record) =>
          `${convertTimeToMMSS(record.timestamp)} \t ${record.subtitle}`
      )
      .join("\n\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", fileName);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleSearchBox = () => {
    setSearchOpen(false);
    setFilteredTranscriptData(undefined);
    setStopScroll(false);
  };

  const onSearchTextChangeHandler = (searchText: string) => {
    if (!transcriptData.length) return;
    if (searchText) {
      setStopScroll(true);
    } else {
      setStopScroll(false);
    }
    const filteredData = transcriptData.filter((record) =>
      record.subtitle.includes(searchText)
    );
    setFilteredTranscriptData(filteredData);
  };

  return (
    <div className="transcript-container">
      {transcriptData.length < 1 && (
        <EmptyTranscriptScreen
          loading={loading}
          hasCC={hasCC}
          fetchTranscriptHandler={getDataHandler}
        />
      )}
      {transcriptData.length > 0 && (
        <div className="scroll-wrapper">
          <ShowTranscripts
            stopScroll={stopScroll}
            syncButtonClickHandler={syncButtonClickHandler}
            transcriptData={filteredTranscriptData || transcriptData}
            currentPlayingTimestamp={currentTS}
            handleBookMarkSave={handleBookMarkSave}
            currentVideoId={currentVideoId}
          />
        </div>
      )}
      <footer>
        <div className="transcript-footer">
          {searchOpen ? (
            <SearchBox
              toggleSearchBox={toggleSearchBox}
              onSearchTextChange={onSearchTextChangeHandler}
            />
          ) : (
            <>
              <Button
                fullWidth
                onClick={onDownloadTranscriptHandler}
                disabled={!transcriptData.length}
              >
                <span>Download</span>
                <DownloadIcon />
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setSearchOpen(true)}
              >
                Search
              </Button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Popup;
