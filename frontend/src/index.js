import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
/* For Dates */
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);
/* For Dates */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <App />
);
