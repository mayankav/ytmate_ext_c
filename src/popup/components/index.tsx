import React from "react";
import "./index.scss";
import Trans from "./Trans";
import CircleIcon from "./ui-components/CircleIcon";
import Sentiments from "./Sentiments";
import { POPUP_TABS } from "../types";
import { AskMeIcon, SentimentIcon, TranscriptIcon } from "../icons";
import AskAI from "./AskAI";

const Popup = () => {
  const [activeTab, setActiveTab] = React.useState<POPUP_TABS>(
    POPUP_TABS.Transcript
  );

  const getIcon = (tab: POPUP_TABS) => {
    switch (tab) {
      case POPUP_TABS.Transcript:
        return <TranscriptIcon />;
      case POPUP_TABS.Sentiment:
        return <SentimentIcon />;
      case POPUP_TABS.AI:
        return <AskMeIcon />;
    }
  };

  return (
    <div className="popup-container">
      <header>
        {Object.values(POPUP_TABS).map((tab) => (
          <div
            key={tab}
            className={activeTab === tab ? "popup-tab active" : "popup-tab"}
            onClick={() => setActiveTab(tab)}
          >
            <div className="icon-wrapper">
              <CircleIcon icon={getIcon(tab)} />
            </div>
            {tab}
          </div>
        ))}
      </header>
      <section>
        {activeTab === POPUP_TABS.Transcript && <Trans />}
        {activeTab === POPUP_TABS.Sentiment && <Sentiments />}
        {activeTab === POPUP_TABS.AI && <AskAI />}
      </section>
    </div>
  );
};

export default Popup;
