import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/Notes.css";
import Sidebar from "./Sidebar";
import api from "../services/api";
import { Pencil } from "lucide-react";

function NotesPage() {
  const [note, setNote] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("salvo");

  // Função para obter token com fallback
  const getToken = () => {
    return localStorage.getItem("access") || localStorage.getItem("token");
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.warn("Token não encontrado");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    api.get("/tasks/", config)
      .then((res) => {
        const existingNote = res.data.find((task) => task.is_note === true);
        if (existingNote) {
          setNote(existingNote.description);
          setTaskId(existingNote.id);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar anotações:", err);
      });
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token || note.trim() === "") return;

    setSaveStatus("salvando");

    const payload = {
      title: "Nota",
      description: note,
      completed: false,
      is_note: true,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const delayDebounceFn = setTimeout(() => {
      if (taskId !== null) {
        api.put(`/tasks/${taskId}/`, payload, config)
          .then(() => setSaveStatus("salvo"))
          .catch((err) => {
            console.error("Erro ao atualizar anotação:", err);
            setSaveStatus("erro");
          });
      } else {
        api.post("/tasks/", payload, config)
          .then((res) => {
            setTaskId(res.data.id);
            setSaveStatus("salvo");
          })
          .catch((err) => {
            console.error("Erro ao criar anotação:", err);
            setSaveStatus("erro");
          });
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [note, taskId]);

  return (
    <div className="notes-wrapper">
      <Sidebar />
      <div className="notes-content">
        <h1 className="notes-title">
          <Pencil size={28} style={{ marginRight: "10px", verticalAlign: "middle" }} />
          Anotações
        </h1>
        <div className="notes-editor">
          <ReactQuill
            theme="snow"
            value={note}
            onChange={setNote}
            placeholder="Escreva sua anotação aqui..."
          />
          <div className="save-status">
            {saveStatus === "salvando" && <span className="saving">💾 Salvando...</span>}
            {saveStatus === "salvo" && <span className="saved">✅ Salvo</span>}
            {saveStatus === "erro" && <span className="error">❌ Erro ao salvar</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotesPage;
