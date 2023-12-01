export enum MessageTypeEnum {
  GET_UNIQUE_VIDEO_ID = "GET_UNIQUE_VIDEO_ID",
  HAS_SUBTITLES = "HAS_SUBTITLES",
  MOVE_VIDEO_TO_TIME = "MOVE_VIDEO_TO_TIME",
}

export type Message =
  | {
      messageType:
        | MessageTypeEnum.GET_UNIQUE_VIDEO_ID
        | MessageTypeEnum.HAS_SUBTITLES;
    }
  | {
      messageType: MessageTypeEnum.MOVE_VIDEO_TO_TIME;
      timestampInSeconds: number;
    };

export type MessageReponse = {
  uniqueVideoId?: string;
  hasSubtitles?: boolean;
};
