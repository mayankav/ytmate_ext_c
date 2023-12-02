import React from "react";
import "./index.scss";

interface ImageAnswerProps {
  time: number;
  answer: string;
}
const ImageAnswer = ({ time, answer }: ImageAnswerProps) => {
  return (
    <div className="image-ans-wrapper">
      <div className="image-time">{time}</div>
      <div className="image-answer">{answer}</div>
    </div>
  );
};

export default ImageAnswer;
