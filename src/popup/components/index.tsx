import React from "react";
import "./index.scss";
import Transcripts from "./components/Transcripts";
import CircleIcon from "./ui-components/CircleIcon";

enum POPUP_TABS {
  Transcript = "Transcript",
  Sentiment = "Sentiment",
  AI = "Ask Me?",
}

const Popup = () => {
  const [activeTab, setActiveTab] = React.useState<POPUP_TABS>(
    POPUP_TABS.Transcript
  );
  return (
    <div className="popup-container">
      <header>
        {Object.values(POPUP_TABS).map((tab) => (
          <div
            key={tab}
            className={activeTab === tab ? "popup-tab active" : "popup-tab"}
            onClick={() => setActiveTab(tab)}
          >
            <CircleIcon />
            {tab}
          </div>
        ))}
      </header>
      <section>
        {activeTab === POPUP_TABS.Transcript && <Transcripts />}
        {activeTab === POPUP_TABS.Sentiment && <div>Sentiment</div>}
        {activeTab === POPUP_TABS.AI && <div>AI</div>}
      </section>
    </div>
  );
};

export default Popup;
