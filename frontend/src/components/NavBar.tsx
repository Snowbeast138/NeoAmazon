// frontend/src/components/Navbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";

import logo from "../assets/NeoAmazonLogo.png"; // Asegúrate de tener un logo en esta ruta

const Navbar: React.FC = () => {
  // Usamos useNavigate() para la navegación, es más limpio
  const navigate = useNavigate();

  // 1. Definimos los items del menú
  const items: MenuItem[] = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Productos",
      icon: "pi pi-shopping-bag",
      command: () => navigate("/products"),
    },
    // Puedes añadir más aquí
    // {
    //   label: "Carrito",
    //   icon: "pi pi-shopping-cart",
    //   command: () => navigate("/cart"),
    // },
  ];

  // 2. Definimos el logo/marca (el "inicio" de la barra)
  const start = (
    <div
      className="flex items-center text-white text-2xl font-bold hover:text-indigo-300 transition-colors duration-200 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img src={logo} alt="NeoAmazon Logo" style={{ height: "120px" }} />
    </div>
  );

  return (
    // 3. Renderizamos el Menubar
    // Le aplicamos las clases de Tailwind para darle el color de fondo
    <div className="card">
      <Menubar
        model={items}
        start={start}
        className="bg-gray-800 rounded-none border-none p-4"
        // PrimeReact usa "pt (pass-through)" para estilizar partes internas
        // Esto es para que los links del menú también sean blancos
        pt={{
          action: { className: "text-gray-300 hover:text-white" },
          icon: { className: "text-gray-300 hover:text-white" },
        }}
      />
    </div>
  );
};

export default Navbar;
