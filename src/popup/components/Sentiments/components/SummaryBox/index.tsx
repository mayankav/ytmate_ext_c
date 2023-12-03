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
      <div className="summary-text">
        {summaryText.split("\n").map((line, index) => (
          <span
            style={{ display: "inline-block", margin: "8px 0px" }}
            key={index}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SummaryBox;
