import React from "react";
import EmptyAskAI from "./components/EmptyAskAI";

const AskAI = () => {
  return (
    <div>
      <EmptyAskAI generateAnswer={() => {}} />
    </div>
  );
};

export default AskAI;
