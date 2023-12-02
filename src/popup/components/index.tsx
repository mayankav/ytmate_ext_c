import React from "react";
import "./index.scss";
import Trans from "./Trans";
import CircleIcon from "./ui-components/CircleIcon";
import { POPUP_TABS } from "../types";

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
            <CircleIcon icon={tab} />
            {tab}
          </div>
        ))}
      </header>
      <section>
        {activeTab === POPUP_TABS.Transcript && <Trans />}
        {activeTab === POPUP_TABS.Sentiment && <div>Sentiment</div>}
        {activeTab === POPUP_TABS.AI && <div>AI</div>}
      </section>
    </div>
  );
};

export default Popup;
