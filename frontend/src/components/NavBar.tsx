// frontend/src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
// Si quieres usar Button de PrimeReact en el Navbar:
// import { Button } from 'primereact/button';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Nombre de la Marca */}
        <Link
          to="/"
          className="text-white text-2xl font-bold hover:text-indigo-300 transition-colors duration-200"
        >
          NeoAmazon
        </Link>

        {/* Links de Navegación */}
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white text-lg transition-colors duration-200"
          >
            Inicio
          </Link>
          <Link
            to="/products"
            className="text-gray-300 hover:text-white text-lg transition-colors duration-200"
          >
            Productos
          </Link>
          {/* Ejemplo de otro link si tuvieras más páginas */}
          {/* <Link to="/cart" className="text-gray-300 hover:text-white text-lg">
            Carrito
          </Link> */}

          {/* Si quieres usar un botón de PrimeReact para "Login" */}
          {/* <Button label="Login" icon="pi pi-user" className="p-button-sm p-button-outlined p-button-secondary" /> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
