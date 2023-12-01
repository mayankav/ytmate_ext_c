export function changeVideoTime(timeinSeconds: number) {
  const video_node = document.querySelector("video");
  video_node.currentTime = timeinSeconds;
}
