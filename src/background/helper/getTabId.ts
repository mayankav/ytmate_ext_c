export function getTabId(callback: (tabId: number) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab) {
      const tabId = currentTab.id;
      console.log("Tab ID:", tabId);
      callback(tabId);
    } else {
      console.error("Unable to get tab information.");
    }
  });
}
