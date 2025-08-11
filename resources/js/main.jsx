import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { BrowserRouter } from "react-router";
import "../css/app.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
