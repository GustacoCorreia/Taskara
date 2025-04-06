import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom"; // Para redirecionamento

function TaskForm({ onTaskAdded, editingTask, onTaskUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate(); // Usado para redirecionamento

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  // Função para obter o token com fallback
  const getToken = () => {
    return localStorage.getItem("access") || localStorage.getItem("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken(); // Obtendo o token
    if (!token) {
      console.error("Usuário não autenticado!");
      navigate("/login"); // Redireciona para a tela de login
      return;
    }

    const taskData = { title, description };

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}/`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onTaskUpdated({ ...editingTask, title, description });
      } else {
        const response = await api.post("/tasks/", taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onTaskAdded(response.data);
      }

      setTitle("");
      setDescription("");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Caso o token seja inválido ou expirado
        console.error("Token expirado ou inválido!");
        localStorage.removeItem("access"); // Remove o token inválido
        navigate("/login"); // Redireciona para o login
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

