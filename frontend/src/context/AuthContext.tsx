import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Intentar recuperar sesión al cargar la página
    try {
      const storedUser = localStorage.getItem("neoamazon_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user from local storage", error);
      localStorage.removeItem("neoamazon_user"); // Si está corrupto, bórralo
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("neoamazon_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("neoamazon_user");
    // Usamos window.location.href para forzar una recarga limpia y borrar estados de memoria
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
