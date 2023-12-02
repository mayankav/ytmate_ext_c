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
      console.log("Training status saved locally:", {
        isModelTrained,
      });
    }
  );
}
