import React from "react";
import { createRoot } from "react-dom/client";

// This is the entry file for popup
const popup = <div>react options</div>;

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(popup);
