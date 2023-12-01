export async function callFisher(videoId: string) {
  // The aws api gateway is configured with path param i.e. videoId
  const fisherGateway =
    "https://c0i44pv7ka.execute-api.ap-south-1.amazonaws.com/dev";
  const callFisherURL = `${fisherGateway}/${videoId}`;
  try {
    //setFisherInProgress(true);
    console.log("fisher called..");
    const response = await fetch(callFisherURL);
    if (!response.ok) {
      //setFisherInProgress(false);
      console.log("fisher all end error 1..");
      throw new Error(`callFisher Error! Status: ${response.status}`);
    }
    const data = await response.json();
    //setFisherInProgress(false);
    console.log("fisher all end success..");
    return data;
  } catch (error) {
    console.log("fisher all end error 2..");
    //setFisherInProgress(false);
    console.error("callFisher Error:", error.message);
  }
}

// function setFisherInProgress(inProgress: boolean) {
//   chrome.storage.local.set({
//     fisherInProgress: inProgress ? 1 : 0,
//   });
// }

// export function isFisherInProgress() {
//   chrome.storage.local.get("fisherInProgress", (result) => {
//     if (result.fisherInProgress === 1) return true;
//   });
//   return false;
// }
