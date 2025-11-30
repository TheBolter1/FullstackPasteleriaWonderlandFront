import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style/style.css";

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <h2 className="loader-title">
          Pastelería
          <br />
          Wonderland
        </h2>
        <div className="loader-spinner"></div>
      </div>
    </div>
  );
}

function Root() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return <Loader />;

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  // 👈 SIN StrictMode, al menos mientras depuras el flasheo
  <Root />
);
