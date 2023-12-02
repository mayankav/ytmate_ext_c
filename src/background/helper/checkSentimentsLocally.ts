export function checkSentimentsLocally(key: string, callback: Function) {
  console.log("checkSentimentsLocally..");
  chrome.storage.local.get(key, function (result) {
    const sentiments = result[key]?.sentiments;
    if (sentiments) callback(sentiments);
  });
}
