import React from "react";
import { createRoot } from "react-dom/client";
import Options from "./Options";

function init() {
  const appContainer = document.createElement("div");
  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);
  root.render(<Options />);
}

init();
