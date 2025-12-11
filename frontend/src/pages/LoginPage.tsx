import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import apiClient from "../services/api";
import { useAuth } from "../context/AuthContext";

// IMPORTAMOS EL CSS NUEVO
import "../Auth.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/users/login", {
        email: email.trim(),
        password: password.trim(),
      });

      login(response.data);

      toast.current?.show({
        severity: "success",
        summary: "Bienvenido",
        detail: "Has iniciado sesión",
      });

      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Toast ref={toast} />

      <div className="auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <h2>
            Bienvenido a <span style={{ color: "#fde047" }}>NeoAmazon</span>
          </h2>
          <p>Inicia sesión para continuar</p>
        </div>

        {/* BODY */}
        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope"></i>
                </span>
                <InputText
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@correo.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  feedback={false}
                  toggleMask
                  placeholder="••••••••"
                  inputStyle={{ width: "100%" }} // Estilo inline para arreglar el input de PrimeReact
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>

            <Button
              label="Ingresar"
              icon="pi pi-arrow-right"
              iconPos="right"
              loading={loading}
              type="submit"
              className="auth-btn"
            />
          </form>

          <div className="auth-footer">
            <span>¿No tienes cuenta?</span>
            <Link to="/register" className="auth-link">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
