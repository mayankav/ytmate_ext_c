export function checkSummaryLocally(
  key: string,
  source: "video" | "comments",
  callback: Function
) {
  chrome.storage.local.get(key, function (result) {
    if (source === "comments") {
      const summary = result[key]?.commentsSummary;
      if (summary) callback(summary);
    } else if (source === "video") {
      const summary = result[key]?.videoSummary;
      if (summary) callback(summary);
    }
  });
}
