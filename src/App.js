import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar.component";
import TodosList from "./components/todos-list.component";
import CreateTodo from "./components/create-todo.component";

function App() {
  return (
    <div className="container">
      <Navbar />
      <Routes>  
        <Route path="/" exact element={<TodosList />} />
        <Route path="/create" element={<CreateTodo />} />
      </Routes>
    </div>
  );
}

export default App;
