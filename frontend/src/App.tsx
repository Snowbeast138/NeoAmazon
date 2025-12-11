// frontend/src/App.tsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProductListPage from "./pages/ProductListPage";
import HomePage from "./pages/HomePage"; // Asegúrate que el nombre de archivo sea HomePage.tsx
import Navbar from "./components/NavBar"; // Asegúrate que el nombre de archivo sea Navbar.tsx
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />

          <main className="flex-grow p-4">
            {" "}
            {/* flex-grow ayuda a empujar el footer si tuvieras */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
