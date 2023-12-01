import { TranscriptRecord } from "../components/Transcript";

export function saveDataLocally(
  key: string,
  transcriptData: Array<TranscriptRecord>,
  commentsData: Array<any>
) {
  const dataToSave = {
    transcriptData,
    commentsData,
  };

  chrome.storage.local.set(
    {
      [key]: dataToSave,
    },
    () => {
      console.log("Data saved locally:", dataToSave);
    }
  );
}
