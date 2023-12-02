import { saveAnswerLocally } from "../helper/saveAnswerLocally";
import { API_BASE_URL } from "./constants";
export function getAnswer(
  vId: string,
  source: "video" | "comments" | "images" | "",
  question: string
) {
  const endpoint = "GetAnswer";
  const url = `${API_BASE_URL}${endpoint}/`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    unique_video_id: vId,
    source,
    question,
  };
  console.log("Getting answer for", question, source);
  fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      saveAnswerLocally(vId, data);
    })
    .catch((error) => {
      console.error("Getting Answer Error:", error);
    });
}
