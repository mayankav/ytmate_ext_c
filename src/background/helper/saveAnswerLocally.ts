export function saveAnswerLocally(key: string, answer: string) {
  const dataToSave = {
    answer,
  };
  chrome.storage.local.set(
    {
      [key]: dataToSave,
    },
    () => {
      console.log("Answer saved locally:", dataToSave);
    }
  );
}
