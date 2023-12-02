export function getVideoIdFromBgScript(callback: (videoId: string) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    console.log("all tabs from bg script:", tabs);
    console.log("Current tab from bg script:", currentTab);
    const tabUrl = currentTab.url;
    console.log("Current tab URL from bg script:", tabUrl);
    // Extract the value of the "v" query parameter explicitly
    // const match = tabUrl.match(/[?&]v=([^&]+)/);
    // const videoId = match ? match[1] : null;
    // Find the index of "?v="
    const startIndex = tabUrl.indexOf("?v=");

    if (startIndex !== -1) {
      // Extract the string after "?v="
      const videoId = tabUrl.substring(startIndex + 3);
      console.log("Extracted videoId:", videoId);
      console.log("Current videoId", videoId);
      if (videoId) callback(videoId);
    } else {
      console.log('"?v=" not found in the URL.');
    }
  });
}
