export function saveSummaryLocally(
  key,
  dataToSave: {
    videoSummary?: string;
    commentsSummary?: string;
  }
) {
  chrome.storage.local.set(
    {
      [key]: dataToSave,
    },
    () => {
      console.log("Summary saved locally:", dataToSave);
    }
  );
}
