// frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PrimeReactProvider } from "primereact/api";

// --- ESTOS TRES SON OBLIGATORIOS ---
import "primereact/resources/themes/lara-light-blue/theme.css"; // 1. El Tema
import "primeicons/primeicons.css"; // 2. Los Iconos
import "./index.css"; // 3. Tailwind CSS
// -----------------------------------

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
