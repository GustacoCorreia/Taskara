import React, { useState, useEffect } from "react";
import api from "../services/api";

function TaskForm({ onTaskAdded, editingTask, onTaskUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Usuário não autenticado!");
      return;
    }

    const taskData = { title, description };

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}/`, taskData, {
          headers: { Authorization: `Token ${token}` },
        });
        onTaskUpdated({ ...editingTask, title, description });
      } else {
        const response = await api.post("/tasks/", taskData, {
          headers: { Authorization: `Token ${token}` },
        });
        onTaskAdded(response.data);
      }

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-lg mx-auto"
    >
      {/* Campo Título */}
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

      {/* Campo Descrição */}
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

      {/* Botão de Ação */}
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
