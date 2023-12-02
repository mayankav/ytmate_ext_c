export function checkAnswerLocally(key: string, callback: Function) {
  console.log("checkAnswerLocally..");
  chrome.storage.local.get(key, function (result) {
    const answer = result[key]?.answer;
    if (answer) callback(answer);
  });
}
