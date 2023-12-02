export function checkDataLocally(key: string, callback: Function) {
  console.log("checkDataLocally..");
  chrome.storage.local.get(key, function (result) {
    const tData = result[key]?.transcriptData;
    const cData = result[key]?.commentsData;
    if (tData && cData) callback(tData, cData);
  });
}
