export function saveAnswerLocally(
  key: string,
  dataToSave: {
    question: string;
    answer: string;
  }
) {
  chrome.storage.local.set(
    {
      [key]: dataToSave,
    },
    () => {
      console.log("Answer saved locally:", dataToSave);
    }
  );
}
