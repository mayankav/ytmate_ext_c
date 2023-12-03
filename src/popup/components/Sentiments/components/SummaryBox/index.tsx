import React from "react";
import "./index.scss";

interface SummaryBoxProps {
  type: "Comments" | "Video";
  summaryText: string;
}
const SummaryBox = ({ type, summaryText }: SummaryBoxProps) => {
  return (
    <div className="summary-box">
      <div className="summary-title">{`${type} Summary`}</div>
      <div className="summary-text">{summaryText}</div>
    </div>
  );
};

export default SummaryBox;
