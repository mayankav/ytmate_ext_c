import { API_BASE_URL } from "./constants";
export function trainModel(vId: string, source: "transcript" | "comments") {
  const endpoint = "TrainQA";
  const url = `${API_BASE_URL}${endpoint}/`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    text_json: {},
    unique_video_id: vId,
    source,
    force_train: false,
  };
  fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .then((response) => {
      console.log("Train Model Success:", response);
    })
    .catch((error) => {
      console.error("Train Model Error:", error);
    });
}
