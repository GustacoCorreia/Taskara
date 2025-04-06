import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css"; // Importa o novo CSS

function Sidebar() {
  const [showModal, setShowModal] = useState(false);

  // Função para exibir o modal de confirmação
  const handleLogoutClick = () => {
    setShowModal(true);
  };

  // Função para realizar o logout e fechar o modal
  const handleConfirmLogout = () => {
    // Aqui você pode adicionar a lógica de logout, como limpar o token
    localStorage.removeItem("access"); // Exemplo de remoção do token

    // Redireciona para a página de login ou home
    window.location.href = "/login"; // Ou o caminho que preferir

    setShowModal(false); // Fecha o modal
  };

  // Função para cancelar o logout e fechar o modal
  const handleCancelLogout = () => {
    setShowModal(false); // Apenas fecha o modal sem fazer logout
  };

  return (
    <>
      <nav className="sidebar">
        <div className="sidebar-logo">Taskara</div>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/home" className="sidebar-link">
              Página Inicial
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className="sidebar-link">
              Minhas Tarefas
            </NavLink>
          </li>
          <li>
            <NavLink to="/notes" className="sidebar-link">
              Anotações
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className="sidebar-link">
              Meu Perfil
            </NavLink>
          </li>
          {/* O botão de Sair é um item de menu comum */}
          <li>
            <a
              href="#"
              className="sidebar-logout"
              onClick={handleLogoutClick}
            >
              Sair
            </a>
          </li>
        </ul>
      </nav>

      {/* Modal de confirmação de logout */}
      {showModal && (
        <div className="logout-modal">
          <div className="modal-content">
            <h3>Tem certeza que deseja sair?</h3>
            <button className="confirm-btn" onClick={handleConfirmLogout}>
              Sim
            </button>
            <button className="cancel-btn" onClick={handleCancelLogout}>
              Não
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
