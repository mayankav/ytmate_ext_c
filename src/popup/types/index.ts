export type TranscriptRecord = {
  subtitle: string;
  timestamp: number;
};

export enum POPUP_TABS {
  Transcript = "Transcript",
  Sentiment = "Insights",
  AI = "Ask Me?",
}
