import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { FaSearch, FaSortUp, FaSortDown, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/tasks").then((response) => {
      setTasks(response.data);
    });
  }, []);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = { text: newTask, completed: false };

    axios.post("http://localhost:5000/tasks", task).then((response) => {
      setTasks([...tasks, response.data]);
      setNewTask("");
    });
  };

  const editTask = (id, newText) => {
    axios.patch(`http://localhost:5000/tasks/${id}`, { text: newText }).then(() => {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, text: newText } : task)));
    });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(search.toLowerCase())
  );
  const sortedTasks = [...filteredTasks].sort((a, b) =>
    sortAsc ? a.text.localeCompare(b.text) : b.text.localeCompare(a.text)
  );

  return (
    <div className="container">
      <h1>🌟 To-Do List 🌟</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}><FaPlus /></button>
      </div>

      <div className="search-sort-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <button className="sort-button" onClick={() => setSortAsc(!sortAsc)}>
          {sortAsc ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>

      <ul className="task-list">
        {sortedTasks.map((task) => (
          <li key={task.id} className="task">
            <span>{task.text}</span>
            <div className="actions">
              <button onClick={() => editTask(task.id, prompt("Edit Task:", task.text))}><FaEdit /></button>
              <button onClick={() => deleteTask(task.id)}><FaTrash /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
