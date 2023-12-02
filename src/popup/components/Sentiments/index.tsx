import React from "react";
import EmotionRow from "./components/EmotionRow";
import "./index.scss";

const Sentiments = () => {
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
