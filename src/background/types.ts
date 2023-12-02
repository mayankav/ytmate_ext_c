type AppState = "active" | "inactive" | "busy";
type ApiNames = "getAnswer" | "getSentiments" | "getSummary" | "trainModel";
type ApiSource = "video" | "comments" | "images" | "";

type Sentiments = {
  joy?: number;
  love?: number;
  sadness?: number;
  fear?: number;
  surprise?: number;
  anger?: number;
};
