// frontend/src/App.tsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProductListPage from "./pages/ProductListPage";
import HomePage from "./pages/HomePage"; // Asegúrate que el nombre de archivo sea HomePage.tsx
import Navbar from "./components/Navbar"; // Asegúrate que el nombre de archivo sea Navbar.tsx

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* --- ENVOLTORIO PRINCIPAL AÑADIDO --- */}
      {/*
        min-h-screen: Asegura que la app ocupe al menos el 100% de la altura de la pantalla.
        bg-gray-100:  Fuerza un fondo gris claro (esto anula el fondo negro del dark mode).
      */}
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        {/* 'main' es un buen contenedor semántico para tus páginas */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            {/* <Route path="/cart" element={<CartPage />} /> */}
          </Routes>
        </main>
      </div>
      {/* --- FIN DEL ENVOLTORIO --- */}
    </BrowserRouter>
  );
};

export default App;
