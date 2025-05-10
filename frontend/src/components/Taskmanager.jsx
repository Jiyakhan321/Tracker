import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const statuses = ["To Do", "In Progress", "Done"];

const TaskManager = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addOrUpdateTask = async () => {
    const taskData = { title, assignedTo, description, status };
    try {
      if (editingTask) {
        await axios.patch(`${apiUrl}/tasks/${editingTask._id}`, taskData);
        setEditingTask(null);
      } else {
        await axios.post(`${apiUrl}/tasks`, taskData);
      }
      fetchTasks();
      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setAssignedTo('');
    setDescription('');
    setStatus('To Do');
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${apiUrl}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === id);
      if (!taskToUpdate) return;

      await axios.patch(`${apiUrl}/tasks/${id}`, {
        title: taskToUpdate.title,
        assignedTo: taskToUpdate.assignedTo,
        description: taskToUpdate.description,
        status: newStatus,
      });

      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error.response ? error.response.data : error.message);
    }
  };

  const handleEditClick = (task) => {
    setTitle(task.title);
    setAssignedTo(task.assignedTo);
    setDescription(task.description || '');
    setStatus(task.status);
    setEditingTask(task);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-teal-300 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-teal-800">Task Manager</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 w-full sm:w-auto"
        >
          Home
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full lg:flex-1 p-3 border-2 border-teal-300 rounded-lg"
        />
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Assigned to"
          className="w-full lg:flex-1 p-3 border-2 border-teal-300 rounded-lg"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="w-full lg:flex-1 p-3 border-2 border-teal-300 rounded-lg"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full lg:flex-1 p-3 border-2 border-teal-300 rounded-lg"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={addOrUpdateTask}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-lg w-full lg:w-auto"
        >
          {editingTask ? "Update" : "Add"}
        </button>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {statuses.map((boardStatus) => (
          <div key={boardStatus} className="bg-white rounded-2xl shadow-2xl p-4">
            <h2 className="text-2xl font-semibold text-center text-teal-700 mb-4">
              {boardStatus}
            </h2>

            {tasks.filter(task => task.status === boardStatus).map(task => (
              <div key={task._id} className="p-3 bg-teal-50 rounded-lg flex flex-col gap-2 break-words">
                <span className="text-gray-800 font-semibold">{task.title}</span>
                <span className="text-gray-600 text-sm">{task.description}</span>
                <span className="text-gray-500 text-xs">Assigned to: {task.assignedTo}</span>
                <div className="flex gap-2 flex-wrap">
                  {boardStatus !== "Done" && (
                    <button
                      onClick={() => updateTaskStatus(task._id, "Done")}
                      className="text-white bg-green-500 hover:bg-green-600 rounded px-3 py-1 text-sm"
                    >
                      Done
                    </button>
                  )}
                  {boardStatus !== "In Progress" && (
                    <button
                      onClick={() => updateTaskStatus(task._id, "In Progress")}
                      className="text-white bg-yellow-500 hover:bg-yellow-600 rounded px-3 py-1 text-sm"
                    >
                      In Progress
                    </button>
                  )}
                  {boardStatus !== "To Do" && (
                    <button
                      onClick={() => updateTaskStatus(task._id, "To Do")}
                      className="text-white bg-blue-500 hover:bg-blue-600 rounded px-3 py-1 text-sm"
                    >
                      To Do
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(task)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}

          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
