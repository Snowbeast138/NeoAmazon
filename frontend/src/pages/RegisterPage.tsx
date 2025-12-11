import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import apiClient from "../services/api";
import { useAuth } from "../context/AuthContext";

// IMPORTAMOS EL CSS
import "../Auth.css";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
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
      const response = await apiClient.post("/users/register", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      login(response.data);

      toast.current?.show({
        severity: "success",
        summary: "Cuenta Creada",
        detail: "Bienvenido a NeoAmazon",
      });
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      let errorMessage = "Error al registrarse";
      // (Tu lógica de error original se mantiene intacta)
      type ErrorResponse = { response?: { data?: { message?: string } } };
      const err = error as ErrorResponse;
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
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
            Únete a <span style={{ color: "#fde047" }}>NeoAmazon</span>
          </h2>
          <p>Crea tu cuenta en segundos</p>
        </div>

        {/* BODY */}
        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre de usuario</label>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText
                  id="name"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope"></i>
                </span>
                <InputText
                  id="email"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  toggleMask
                  placeholder="Mínimo 6 caracteres"
                  inputStyle={{ width: "100%" }}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>

            <Button
              label="Registrarse"
              icon="pi pi-check"
              iconPos="right"
              loading={loading}
              type="submit"
              className="auth-btn"
            />
          </form>

          <div className="auth-footer">
            <span>¿Ya tienes cuenta?</span>
            <Link to="/login" className="auth-link">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
