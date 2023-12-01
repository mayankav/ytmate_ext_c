export function hasSubtitles() {
  if (
    document
      .querySelector(".ytp-subtitles-button-icon")
      .getAttribute("fill-opacity") !== "1"
  ) {
    // ASSUMPTION
    // since the CC button under the YT video is not opaque when no transcript
    return false;
  }
  return true;
}
// hasSubtitles();
