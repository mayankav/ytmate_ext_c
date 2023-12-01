import { TranscriptRecord } from "../popup/components/Transcript";

export enum MessageTypeEnum {
  GET_UNIQUE_VIDEO_ID = "GET_UNIQUE_VIDEO_ID",
  HAS_SUBTITLES = "HAS_SUBTITLES",
  MOVE_VIDEO_TO_TIME = "MOVE_VIDEO_TO_TIME",
  CALL_FISHER = "CALL_FISHER",
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
    }
  | {
      messageType: MessageTypeEnum.CALL_FISHER;
      videoId: string;
    };

export type MessageReponse = {
  uniqueVideoId?: string;
  hasSubtitles?: boolean;
  tData?: Array<TranscriptRecord>;
  cData?: Array<any>;
};
