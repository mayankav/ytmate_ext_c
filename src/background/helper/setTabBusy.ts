import { handlePageIconChangeByStatus } from "../helper";

export function setTabBusy(tabId: number, busy: boolean) {
  handlePageIconChangeByStatus(busy, tabId);
  const status = {
    busy,
  };
  chrome.storage.local.set(
    {
      [tabId]: status,
    },
    () => {
      console.log(`Tab ${tabId} set busy:`, status);
    }
  );
}

export function checkIsTabBusy(
  tabId: number,
  callback: (isTabBusy: boolean) => void
) {
  console.log("checkIsTabBusy..");
  chrome.storage.local.get(String(tabId), function (result) {
    const isBusy = !!result[tabId]?.busy;
    callback(isBusy);
  });
}
