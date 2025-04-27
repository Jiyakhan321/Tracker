import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

function Dashboard() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get('/api/tasks', { headers: { Authorization: token } });
      setTasks(res.data);
    };
    fetchTasks();
  }, [token]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    await axios.put(`/api/tasks/${taskId}`, { status: newStatus }, { headers: { Authorization: token } });
    setTasks((prev) =>
      prev.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  const statuses = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="container">
      <button onClick={logout}>Logout</button>
      <h2>Welcome {user.username}</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
                  <h3>{status}</h3>
                  {tasks.filter((task) => task.status === status).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h4>{task.title}</h4>
                          <small>Assigned: {task.assignedTo?.username}</small>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;
