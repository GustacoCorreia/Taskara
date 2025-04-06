import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/token/", { username, password });

      // Corrigido: salva os tokens corretamente
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/home"); // Redireciona após login
    } catch (error) {
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-logo">Taskara</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Usuário:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu usuário"
            />
          </div>
          <div className="input-group">
            <label>Senha:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite sua senha"
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button className="button-login">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
