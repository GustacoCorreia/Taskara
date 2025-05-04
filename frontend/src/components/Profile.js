import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/Profile.css";

function Profile() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://localhost:8000/api/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar dados do usuário");
        }
        return res.json();
      })
      .then((data) => {
        setUserData({ username: data.username, email: data.email });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    try {
      const response = await fetch("http://localhost:8000/api/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Erro ao alterar senha");
      } else {
        setMessage("Senha alterada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setShowPasswordForm(false);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage("Erro ao alterar senha.");
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-container">
        <h2>Meu Perfil</h2>
        <p><strong>Nome:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>

        <button className="change-password-button" onClick={() => setShowPasswordForm(!showPasswordForm)}>
          {showPasswordForm ? "Cancelar" : "Alterar Senha"}
        </button>

        {showPasswordForm && (
          <form className="password-form" onSubmit={handlePasswordChange}>
            <div>
              <label>Senha Atual:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Nova Senha:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Salvar Nova Senha</button>
            {message && <p className="message">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
