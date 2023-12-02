export function saveTrainingStatusLocally(
  key: string,
  isModelTrained: boolean
) {
  chrome.storage.local.set(
    {
      [key]: {
        isModelTrained,
      },
    },
    () => {
      console.log("Data saved locally:", {
        isModelTrained,
      });
    }
  );
}
