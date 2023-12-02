import { API_BASE_URL } from "./constants";
export function getAnswer(
  vId: string,
  source: "video" | "comments" | "images" | ""
) {
  const endpoint = "GetAnswer";
  const url = `${API_BASE_URL}${endpoint}/`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    text_json: {},
    unique_video_id: vId,
    source,
    force_train: false,
  };
  console.log("Getting answer for", source);
  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}
