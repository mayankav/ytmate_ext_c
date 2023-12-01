export function getUniqueVideoId() {
  const urlParams = new URLSearchParams(document.location.search.substring(1));
  const videoId = urlParams.get("v");
  return videoId;
}
