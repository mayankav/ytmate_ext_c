export async function callFisher(videoId: string) {
  // The aws api gateway is configured with path param i.e. videoId
  const fisherGateway =
    "https://c0i44pv7ka.execute-api.ap-south-1.amazonaws.com/dev";
  const callFisherURL = `${fisherGateway}/${videoId}`;
  try {
    const response = await fetch(callFisherURL);
    if (!response.ok) {
      throw new Error(`callFisher Error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("callFisher Error:", error.message);
  }
}
