import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "./app/styles/tailwind.css";

async function bootstrap() {
  // Always start MSW in development (this is a mock-only project)
  const { startMockServer } = await import("./shared/api/mockServer/server");
  await startMockServer();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
