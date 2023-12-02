export enum MessageToContentScriptTypeEnum {
  GET_UNIQUE_VIDEO_ID = "GET_UNIQUE_VIDEO_ID",
  HAS_SUBTITLES = "HAS_SUBTITLES",
  MOVE_VIDEO_TO_TIME = "MOVE_VIDEO_TO_TIME",
  CALL_FISHER = "CALL_FISHER",
}

export type MessageToContentScript =
  | {
      messageType:
        | MessageToContentScriptTypeEnum.GET_UNIQUE_VIDEO_ID
        | MessageToContentScriptTypeEnum.HAS_SUBTITLES;
    }
  | {
      messageType: MessageToContentScriptTypeEnum.MOVE_VIDEO_TO_TIME;
      timestampInSeconds: number;
    }
  | {
      messageType: MessageToContentScriptTypeEnum.CALL_FISHER;
      videoId: string;
    };

export type MessageToContentScriptReponse = {
  uniqueVideoId?: string;
  hasSubtitles?: boolean;
  tData?: Array<TranscriptRecord>;
  cData?: Array<any>;
};

export type TranscriptRecord = {
  subtitle: string;
  timestamp: number;
};

export enum MessageToBgScriptTypeEnum {
  CALL_AN_API = "CALL_AN_API",
}

type AppState = "active" | "inactive" | "busy";
type ApiNames = "getAnswer" | "getSentiments" | "getSummary" | "trainModel";
type ApiSource = "video" | "comments" | "images" | "";

export enum ApiNamesEnum {
  getAnswer = "getAnswer",
  getSentiments = "getSentiments",
  getSummary = "getSummary",
  trainModel = "trainModel",
}

export enum ApiSourceEnum {
  video = "video",
  comments = "comments",
  images = "images",
  none = "",
}
export type MessageToBgScript = {
  action: MessageToBgScriptTypeEnum.CALL_AN_API;
  apiName: ApiNames;
  source: ApiSource;
};

export type MessageToBgScriptReponse = {} | void;

export enum MessageToPopupTypeEnum {
  STORAGE_UPDATE = "STORAGE_UPDATED",
}
export type MessageToPopup = {
  messageType: MessageToPopupTypeEnum.STORAGE_UPDATE;
  property: string;
};
