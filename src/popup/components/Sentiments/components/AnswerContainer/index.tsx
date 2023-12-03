import React from "react";
import "./index.scss";

const AnsweContainer = ({ ansText }: { ansText: string }) => {
  return <div className="ans-container">{ansText}</div>;
};

export default AnsweContainer;
