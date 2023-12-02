import { checkIsModelTrained } from "../helper/checkIsModelTrained";
import { saveTrainingStatusLocally } from "../helper/saveTrainingStatusLocally";
import { API_BASE_URL } from "./constants";
export function trainModel(
  vId: string,
  source: "video" | "comments" | "images"
) {
  const endpoint = "TrainQA";
  const url = `${API_BASE_URL}${endpoint}/`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    text_json: {},
    unique_video_id: vId,
    source,
    force_train: false,
  };
  console.log("Training model for", source);
  checkIsModelTrained(vId, (isModelTrained) => {
    if (isModelTrained) {
      console.log("Model already trained for video", vId);
    } else {
      fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })
        .then((response) => {
          console.log("Comments Training Success", response.status);
          saveTrainingStatusLocally(vId, true);
        })
        .catch((error) => {
          console.error("Comments Training Error:", error);
          saveTrainingStatusLocally(vId, false);
        });
    }
  });
}
