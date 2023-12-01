// write a function to convert 1 - 00:01, 60 - 01:00, 61 - 01:01
export const convertTimeToMMSS = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutesString}:${secondsString}`;
};