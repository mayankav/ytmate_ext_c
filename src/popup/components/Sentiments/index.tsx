import React, { useEffect, useState } from "react";
import EmotionRow from "./components/EmotionRow";
import "./index.scss";
import { sendMessageToBgScript } from "../../helper/sendMessageToBgScript";
import {
  ApiNamesEnum,
  ApiSourceEnum,
  MessageToBgScript,
  MessageToBgScriptTypeEnum,
} from "../../../types";

const Sentiments = () => {
  const [sentimentsData, setSentimentsData] = useState<Sentiments>(null);
  useEffect(() => {
    const message: MessageToBgScript = {
      action: MessageToBgScriptTypeEnum.CALL_AN_API,
      apiName: ApiNamesEnum.getSentiments,
      source: ApiSourceEnum.none,
    };
    sendMessageToBgScript(message, (response) => {
      console.log("Sentiments component: response from bg script", response);
      if (response.sentiments) {
        setSentimentsData(response.sentiments);
      }
    });
  });
  useEffect(() => {
    console.log("UPDATED IN SENTIMENTS", sentimentsData);
  }, [sentimentsData]);
  return (
    <div className="sentiments-wrapper">
      <EmotionRow
        type="positive"
        percentage={21}
        description="People feel happy about this"
      />
      <EmotionRow
        type="neutral"
        percentage={60}
        description="People feel neutral about this"
      />
      <EmotionRow
        type="negative"
        percentage={19}
        description="People feel sad about this"
      />
    </div>
  );
};

export default Sentiments;
