import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";                  // ✅ keep Tailwind imports
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";  // ✅ Auth context

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) =>
      console.warn('SW registration failed:', err)
    );
  });
}
