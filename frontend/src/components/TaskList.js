import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "./Sidebar";
import "../styles/TaskList.css";

function TaskList() {
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dailyTaskId, setDailyTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
    priority: "baixa",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("access") || localStorage.getItem("token");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const filterAndSortTasks = useCallback((tasks) => {
    let filtered = tasks;
    if (filter === "completed") filtered = tasks.filter((t) => t.completed);
    else if (filter === "pending") filtered = tasks.filter((t) => !t.completed);
    return filtered.sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));
  }, [filter, sortOrder]);

  const fetchTasks = useCallback(async (token) => {
    try {
      const res = await api.get("/tasks/", { headers: { Authorization: `Bearer ${token}` } });
      setAllTasks(res.data);
      setTasks(filterAndSortTasks(res.data));
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access");
        navigate("/login");
      }
    }
  }, [navigate, filterAndSortTasks]);

  const fetchDailyTask = useCallback(async (token) => {
    try {
      const res = await api.get("/tasks/daily/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDailyTaskId(res.data.id);
    } catch (err) {
      if (err.response?.status === 404) {
        setDailyTaskId(null);
      }
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      showMessage("⚠️ Sessão expirada. Faça login novamente.");
      return navigate("/login");
    }
    fetchTasks(token);
    fetchDailyTask(token);
  }, [navigate, fetchTasks, fetchDailyTask]);
  
  useEffect(() => {
  const interval = setInterval(() => {
    setTasks((prev) => [...prev]); // força re-render para atualizar os visuais
  }, 5000); // atualiza a cada 5 segundos

  return () => clearInterval(interval);
}, []);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    const token = getToken();
    if (!token) return navigate("/login");

    try {
      const res = await api.post("/tasks/", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = [res.data, ...allTasks];
      setAllTasks(updated);
      setTasks(filterAndSortTasks(updated));
      setNewTask({ title: "", description: "", completed: false, priority: "baixa" });
      showMessage("✅ Tarefa adicionada com sucesso!");
      setIsModalOpen(false);
    } catch {
      showMessage("❌ Erro ao adicionar tarefa!");
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!selectedTask.title.trim()) return;
    const token = getToken();
    if (!token) return navigate("/login");

    try {
      await api.put(`/tasks/${selectedTask.id}/`, selectedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedAll = allTasks.map((t) => (t.id === selectedTask.id ? selectedTask : t));
      setAllTasks(updatedAll);
      setTasks(filterAndSortTasks(updatedAll));
      showMessage("✅ Tarefa atualizada com sucesso!");
      setIsEditModalOpen(false);
    } catch {
      showMessage("❌ Erro ao atualizar tarefa!");
    }
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  const handleDeleteTask = async () => {
    const token = getToken();
    if (!token || !taskToDelete) return navigate("/login");

    try {
      await api.delete(`/tasks/${taskToDelete.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedAll = allTasks.filter((t) => t.id !== taskToDelete.id);
      setAllTasks(updatedAll);
      setTasks(filterAndSortTasks(updatedAll));
      if (dailyTaskId === taskToDelete.id) setDailyTaskId(null);
      setIsEditModalOpen(false);
      showMessage("✅ Tarefa deletada com sucesso!");
    } catch {
      showMessage("❌ Erro ao deletar tarefa!");
    } finally {
      setTaskToDelete(null);
    }
  };

  const handleSetDailyTask = async (id) => {
    const token = getToken();
    if (!token) return navigate("/login");

    try {
      await api.post(`/tasks/${id}/set_daily/`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDailyTaskId(id);
      fetchTasks(token);
      showMessage("🌟 Tarefa do Dia atualizada!");
    } catch {
      showMessage("❌ Erro ao definir tarefa do dia.");
    }
  };

  const isTaskOverdue = (task) => {
    if (task.completed || !task.created_at) return false;
    const created = new Date(task.created_at);
    const now = new Date();
    let ms = 7 * 24 * 60 * 60 * 1000; // padrão: 7 dias em milissegundos
    if (task.priority === "moderada") ms = 3 * 24 * 60 * 60 * 1000;
    if (task.priority === "alta") ms = 10 * 1000; // 10 segundos para prioridade alta
    const deadline = new Date(created.getTime() + ms);
    return now > deadline;
  };

  const dailyTask = allTasks.find((t) => t.id === dailyTaskId);

  return (
    <div className="task-page">
      <Sidebar />
      <div className="task-container">
        <h2 className="task-title">📌 Minhas Tarefas</h2>
        {message && <p className="task-message">{message}</p>}

        {dailyTask && (
          <div className="daily-task-box">
            <h3>🌟 Foco do Dia</h3>
            <p><strong>{dailyTask.title}</strong></p>
            <p>{dailyTask.description}</p>
          </div>
        )}

        <div className="task-filters">
          <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="filter-button">
            {sortOrder === "asc" ? "👆 Mais antigas" : "👇 Mais novas"}
          </button>
          <button onClick={() => setFilter("all")} className="filter-button">Todas</button>
          <button onClick={() => setFilter("pending")} className="filter-button">Apenas Pendentes</button>
          <button onClick={() => setFilter("completed")} className="filter-button">Apenas Concluídas</button>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="add-task-button">➕ Adicionar Tarefa</button>

        <ul className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">Você ainda não tem tarefas.</p>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className={`task-item ${isTaskOverdue(task) ? "overdue" : ""}`}>
                <div className="task-info" onClick={() => handleEditTask(task)}>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                  <span className={`status ${task.completed ? "completed" : "pending"}`}>
                    {task.completed ? "✔️ Concluída" : "⏳ Pendente"}
                  </span>
                  <span className="priority">Prioridade: {task.priority}</span>
                </div>
                <div className={`deadline-box ${isTaskOverdue(task) ? "overdue-box" : "in-time-box"}`}>
                  {isTaskOverdue(task) ? "⏰ Fora do prazo" : "✅ Dentro do prazo"}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal de Adição */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Adicionar Tarefa</h3>
            <input type="text" placeholder="Título da tarefa" value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            <textarea placeholder="Descrição" value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
            <label>
              <input type="checkbox" checked={newTask.completed}
                onChange={(e) => setNewTask({ ...newTask, completed: e.target.checked })} />
              Tarefa concluída
            </label>
            <select value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
              <option value="baixa">Baixa</option>
              <option value="moderada">Moderada</option>
              <option value="alta">Alta</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleAddTask} className="save-button">Salvar</button>
              <button onClick={() => setIsModalOpen(false)} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Tarefa</h3>
            <input type="text" value={selectedTask.title}
              onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} />
            <textarea value={selectedTask.description}
              onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })} />
            <label>
              <input type="checkbox" checked={selectedTask.completed}
                onChange={(e) => setSelectedTask({ ...selectedTask, completed: e.target.checked })} />
              Tarefa concluída
            </label>
            <select value={selectedTask.priority}
              onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}>
              <option value="baixa">Baixa</option>
              <option value="moderada">Moderada</option>
              <option value="alta">Alta</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleUpdateTask} className="save-button">Salvar</button>
              <button onClick={() => setIsEditModalOpen(false)} className="cancel-button">Cancelar</button>
              <button onClick={() => confirmDeleteTask(selectedTask)} className="delete-button">Deletar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Confirmação de Exclusão */}
      {taskToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar exclusão</h3>
            <p>Tem certeza que deseja excluir a tarefa <strong>{taskToDelete.title}</strong>?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteTask} className="delete-button">Sim, excluir</button>
              <button onClick={cancelDeleteTask} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
}

export default TaskList;
