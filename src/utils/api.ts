// API utility for Kanban tasks

//const API_URL = 'http://localhost:5000/api'; // Change to your deployed backend URL if needed
const API_URL = 'https://vibecoding-wd29.onrender.com/api';
import axios from 'axios';
export async function fetchTasks() {
  const res = await axios.get(`${API_URL}/tasks`);
  return res.data;
}

export async function createTask(task) {
  const res = await axios.post(`${API_URL}/tasks`, task);
  return res.data;
}

export async function updateTask(id, updates) {
  const res = await axios.put(`${API_URL}/tasks/${id}`, updates);
  return res.data;
}

export async function deleteTask(id) {
  const res = await axios.delete(`${API_URL}/tasks/${id}`);
  return res.data;
}

// Also provide a default export to be resilient to different import styles
export default {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
};
