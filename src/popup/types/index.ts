export type TranscriptRecord = {
  subtitle: string;
  timestamp: number;
};

export enum POPUP_TABS {
  Transcript = "Transcript",
  Sentiment = "Sentiment",
  AI = "Ask Me?",
}
