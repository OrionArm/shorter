import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app";
import { registerServiceWorker } from "./shared/use_service_worker";

registerServiceWorker({
  onUpdateAvailable: () => {
    console.log("Update available");
  },
  onOfflineReady: () => {
    console.log("App ready to work offline");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
