// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx"; // El componente principal de tu aplicación
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App /> {/* Aquí solo necesitas un BrowserRouter que envuelva a App */}
    </Router>
  </React.StrictMode>
);
