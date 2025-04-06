import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "./Sidebar";
import "../styles/TaskList.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", completed: false });
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para o menu de usuário
  const navigate = useNavigate();

  // Função que filtra e ordena as tarefas
  const filterAndSortTasks = (tasks) => {
    let filteredTasks = tasks;
    if (filter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (filter === "pending") {
      filteredTasks = tasks.filter((task) => !task.completed);
    }

    filteredTasks = filteredTasks.sort((a, b) => {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    });

    return filteredTasks;
  };

  // Função para obter o token
  const getToken = () => {
    return localStorage.getItem("access") || localStorage.getItem("token");
  };

  const fetchTasks = useCallback(async (token) => {
    try {
      const response = await api.get("/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedAndFilteredTasks = filterAndSortTasks(response.data);
      setTasks(sortedAndFilteredTasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access"); // Remove o token inválido
        navigate("/login"); // Redireciona para a tela de login
      }
    }
  }, [navigate, filter, sortOrder]); // Adicionando dependências

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login"); // Redireciona se não houver token
      return;
    }
    fetchTasks(token); // Busca as tarefas
  }, [navigate, fetchTasks]); // Adicionando fetchTasks nas dependências

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchTasks(token); // Busca as tarefas com o token
    }
  }, [filter, sortOrder, fetchTasks]); // Adicionando fetchTasks nas dependências

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    const token = getToken();
    try {
      const response = await api.post("/tasks/", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => [response.data, ...prevTasks]);
      setMessage("✅ Tarefa adicionada com sucesso!");
      setNewTask({ title: "", description: "", completed: false });
      setIsModalOpen(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      setMessage("❌ Erro ao adicionar tarefa!");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true); // Abre o modal de edição
  };

  const handleUpdateTask = async () => {
    if (!selectedTask.title.trim()) return;
    const token = getToken();
    try {
      await api.put(`/tasks/${selectedTask.id}/`, selectedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((task) => (task.id === selectedTask.id ? selectedTask : task)));
      setMessage("✅ Tarefa atualizada com sucesso!");
      setIsEditModalOpen(false); // Fecha o modal de edição
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setMessage("❌ Erro ao atualizar tarefa!");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar esta tarefa?")) return;
    const token = getToken();
    try {
      await api.delete(`/tasks/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== id));
      setMessage("✅ Tarefa deletada com sucesso!");
      setIsEditModalOpen(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      setMessage("❌ Erro ao deletar tarefa!");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access"); // Limpa o token do localStorage
    navigate("/login"); // Redireciona para a tela de login
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="task-page">
      <Sidebar />
      <div className="task-container">
        <h2 className="task-title">📌 Minhas Tarefas</h2>
        {message && <p className="task-message">{message}</p>}

        <div className="task-filters">
          <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="filter-button">
            {sortOrder === "asc" ? "👆 Mais antigas" : "👇 Mais novas"}
          </button>
          <button onClick={() => setFilter("all")} className="filter-button">
            Todas
          </button>
          <button onClick={() => setFilter("pending")} className="filter-button">
            Apenas Pendentes
          </button>
          <button onClick={() => setFilter("completed")} className="filter-button">
            Apenas Concluídas
          </button>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="add-task-button">
          ➕ Adicionar Tarefa
        </button>

        <ul className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">Você ainda não tem tarefas.</p>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="task-item" onClick={() => handleEditTask(task)}>
                <div className="task-info">
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                  <span className={`status ${task.completed ? "completed" : "pending"}`}>
                    {task.completed ? "✔️ Concluída" : "⏳ Pendente"}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal para Adicionar Tarefa */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Adicionar Tarefa</h3>
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <label>
              <input
                type="checkbox"
                checked={newTask.completed}
                onChange={(e) => setNewTask({ ...newTask, completed: e.target.checked })}
              />
              Tarefa concluída
            </label>
            <div className="modal-buttons">
              <button onClick={handleAddTask} className="save-button">Salvar</button>
              <button onClick={() => setIsModalOpen(false)} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Tarefa */}
      {isEditModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Tarefa</h3>
            <input
              type="text"
              value={selectedTask.title}
              onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
            />
            <textarea
              value={selectedTask.description}
              onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
            />
            <label>
              <input
                type="checkbox"
                checked={selectedTask.completed}
                onChange={(e) => setSelectedTask({ ...selectedTask, completed: e.target.checked })}
              />
              Tarefa concluída
            </label>
            <div className="modal-buttons">
              <button onClick={handleUpdateTask} className="save-button">Salvar</button>
              <button onClick={() => setIsEditModalOpen(false)} className="cancel-button">Cancelar</button>
              <button onClick={() => handleDeleteTask(selectedTask.id)} className="delete-button">Deletar</button>
            </div>
          </div>
        </div>
      )}

      <div className="user-menu">
        <button onClick={toggleMenu} className="user-button">👤</button>
        {isMenuOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout} className="logout-button">
              🚪 Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskList;
