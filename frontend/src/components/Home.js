import React from "react";
import Sidebar from "./Sidebar";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="home-content">
        <h1>Bem-vindo ao Taskara!</h1>
      </div>
    </div>
  );
}

export default Home;
