import React, { useState } from "react";
import EmptyAskAI from "./components/EmptyAskAI";
import Button from "../ui-components/button";
import { AskMeIconWhite, AskMeIconBig } from "../../icons";
import "./index.scss";

const AskAI = () => {
  const [promptText, setPromptText] = useState("");
  const generateAnswer = () => {
    console.log(promptText);
  };
  const handlePromptChange = (e) => {
    setPromptText(e.target.value);
  };
  return (
    <div className="askai-wrapper">
      <EmptyAskAI />
      <textarea onChange={handlePromptChange} />
      <Button iconRight={<AskMeIconWhite />} onClick={generateAnswer}>
        Generate
      </Button>
    </div>
  );
};

export default AskAI;
