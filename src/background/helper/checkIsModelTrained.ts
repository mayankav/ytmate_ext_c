export function checkIsModelTrained(key: string, callback: Function) {
  console.log("checkIsModelTrained..");
  chrome.storage.local.get(key, function (result) {
    const isModelTrained = !!result[key]?.isModelTrained;
    callback(isModelTrained);
  });
}
