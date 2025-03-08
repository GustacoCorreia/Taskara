import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import Home from "./components/Home"; // Importando a Home

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/home" element={<Home />} /> {/* Página Home */}
        <Route path="/" element={<Home />} /> {/* Redirecionando para a Home */}
      </Routes>
    </Router>
  );
}

export default App;
