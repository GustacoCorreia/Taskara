import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function TaskForm({ onTaskAdded, editingTask, onTaskUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFocus, setIsFocus] = useState(false); // 🆕 novo estado
  const navigate = useNavigate();

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setIsFocus(editingTask.is_focus || false); // 🆕 preenche o estado
    } else {
      setTitle("");
      setDescription("");
      setIsFocus(false);
    }
  }, [editingTask]);

  const getToken = () => {
    return localStorage.getItem("access") || localStorage.getItem("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      console.error("Usuário não autenticado!");
      navigate("/login");
      return;
    }

    const taskData = { title, description, is_focus: isFocus }; // 🆕 inclui is_focus

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}/`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onTaskUpdated({ ...editingTask, title, description, is_focus: isFocus });
      } else {
        const response = await api.post("/tasks/", taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onTaskAdded(response.data);
      }

      setTitle("");
      setDescription("");
      setIsFocus(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Token expirado ou inválido!");
        localStorage.removeItem("access");
        navigate("/login");
      } else {
        console.error("Erro ao salvar tarefa:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-lg mx-auto"
    >
      <div className="flex flex-col">
        <label className="text-lg font-semibold text-gray-700 mb-1">Título</label>
        <input
          type="text"
          placeholder="Digite o título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-semibold text-gray-700 mb-1">Descrição</label>
        <textarea
          placeholder="Descreva a tarefa"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🆕 Checkbox Tarefa do Dia */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isFocus"
          checked={isFocus}
          onChange={(e) => setIsFocus(e.target.checked)}
          className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isFocus" className="text-gray-700 font-medium">
          Marcar como Tarefa do Dia
        </label>
      </div>

      <button
        type="submit"
        className={`w-full p-3 text-white text-lg font-semibold rounded-lg transition 
          ${editingTask ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}
        `}
      >
        {editingTask ? "💾 Atualizar" : "➕ Adicionar"}
      </button>
    </form>
  );
}

export default TaskForm;


