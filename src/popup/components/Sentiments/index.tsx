import React, { useState, useEffect } from "react";
import EmotionRow from "./components/EmotionRow";
import "./index.scss";
import Button from "../ui-components/button";
import { AskMeIcon } from "../../icons";
import EmptySentimentScreen from "./components/EmptySentimentScreen";
import { sendMessageToBgScript } from "../../helper/sendMessageToBgScript";
import {
  ApiNamesEnum,
  ApiSourceEnum,
  MessageToBgScript,
  MessageToBgScriptTypeEnum,
} from "../../../types";

const Sentiments = () => {
  // temporary state to toggle between empty and filled sentiment screen
  const [sentiments, setSentiments] = useState(false);
  const onAnalyseClickHandler = () => {
    setSentiments(!sentiments);
  };
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
  return sentiments ? (
    <>
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
      <footer>
        <Button variant="secondary" fullWidth iconRight={<AskMeIcon />}>
          Know more with AI?
        </Button>
      </footer>
    </>
  ) : (
    <EmptySentimentScreen onAnalyseClickHandler={onAnalyseClickHandler} />
  );
};

export default Sentiments;
