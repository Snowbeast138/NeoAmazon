// frontend/src/App.tsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./App.css"; // Esto ya no es necesario si usas Tailwind/PrimeReact para todo

// Importa tus componentes
import ProductListPage from "./pages/ProductListPage";
import HomePage from "./pages/homepage"; // <-- Importa la HomePage
import Navbar from "./components/NavBar"; // <-- Importa el Navbar

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* El Navbar va FUERA de <Routes> para que aparezca en todas las páginas */}
      <Navbar />

      <Routes>
        {/* Ruta para la página de inicio (ahora activa) */}
        <Route path="/" element={<HomePage />} />

        {/* Ruta para la lista de productos */}
        <Route path="/products" element={<ProductListPage />} />

        {/* Ruta para el carrito (ejemplo) */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
