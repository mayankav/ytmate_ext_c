import { checkIsModelTrained } from "../helper/checkIsModelTrained";
import { saveSentimentsLocally } from "../helper/saveSentimentsLocally";
import { API_BASE_URL } from "./constants";
export function getSentiments(
  vId: string,
  source: "video" | "comments" | "images"
) {
  const endpoint = "ClassifyComments";
  const url = `${API_BASE_URL}${endpoint}/`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    text_json: {},
    unique_video_id: vId,
    source,
    force_train: false,
  };

  checkIsModelTrained(vId, (isModelTrained) => {
    if (!isModelTrained) {
      console.log("Model is not trained for video", vId);
      console.log(
        "Sentiments can only be fetched when comments model is trained"
      );
    } else {
      console.log("Getting sentiments for", source);
      fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          saveSentimentsLocally(vId, data);
        })
        .catch((error) => {
          console.error("Getting Sentiments Error:", error);
        });
    }
  });
}
