import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css"; // Importa o novo CSS

function Sidebar() {
  return (
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
      </ul>
    </nav>
  );
}

export default Sidebar;
