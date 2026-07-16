import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.tsx";
import "./styles/global.css";

// HashRouter (not BrowserRouter) on purpose: GitHub Pages serves static
// files with no server-side rewrite rules, so a direct link or refresh on
// a client-side route like /donor/history would 404 with BrowserRouter.
// Hash-based routing (/#/donor/history) works with zero server config.
// If this app later moves to a host with proper rewrites (Vercel, Netlify,
// a real backend server), swap this back to BrowserRouter.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
