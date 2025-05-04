import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import Home from "./components/Home";
import NotesPage from "./components/Notas";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notes" element={<NotesPage />} /> {/* ✅ Nova rota */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

