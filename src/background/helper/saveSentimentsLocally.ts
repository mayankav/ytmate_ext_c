export function saveSentimentsLocally(key: string, sentiments: Sentiments) {
  const dataToSave = {
    sentiments,
  };
  chrome.storage.local.set(
    {
      [key]: dataToSave,
    },
    () => {
      console.log("Sentiments saved locally:", dataToSave);
    }
  );
}
