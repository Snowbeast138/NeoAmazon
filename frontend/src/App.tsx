import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProductListPage from "./pages/ProductListPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Aquí podrías poner tu Navbar (barra de navegación) */}
      <Routes>
        {/* Ruta para la página de inicio (ejemplo) */}
        {/* <Route path="/" element={<HomePage />} /> */}

        {/* Ruta para la lista de productos */}
        <Route path="/products" element={<ProductListPage />} />

        {/* Ruta para el carrito (ejemplo) */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
