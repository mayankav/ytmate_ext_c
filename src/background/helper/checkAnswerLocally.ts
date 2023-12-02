export function checkAnswerLocally(key: string, callback: Function) {
  chrome.storage.local.get(key, function (result) {
    const answer = result[key]?.answer;
    if (answer) callback(answer);
  });
}
