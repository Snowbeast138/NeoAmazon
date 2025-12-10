// frontend/src/pages/HomePage.tsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    // --- CLASES DE FONDO Y ALTURA ELIMINADAS DE AQUÍ ---
    // 'p-6' está bien, pero el resto lo controla App.tsx
    <div
      className="flex flex-col items-center justify-center p-6"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {" "}
      {/* 64px es un alto de navbar aprox. */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
        Bienvenido a <span className="text-indigo-600">NeoAmazon</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 mb-10 text-center max-w-2xl">
        Tu destino para comprar y vender productos en línea.
      </p>
      <Link
        to="/products"
        className="
        px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-xl 
        hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-75
      "
      >
        Explorar Productos
      </Link>
    </div>
  );
};

export default HomePage;
