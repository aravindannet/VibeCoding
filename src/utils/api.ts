import axios from 'axios';

// Use environment variable for API URL, fallback to production if not set
// Dynamic API URL: localhost for development, production backend for deployment
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : (import.meta.env.VITE_API_URL || "https://vibecoding-wd29.onrender.com/api");

// Note: For Netlify deployment, set VITE_API_URL environment variable in Netlify dashboard
// pointing to your deployed backend (e.g., https://your-backend.onrender.com/api)

export async function getUserByUid(uid) {
  const res = await axios.get(`${API_URL}/users/${uid}`);
  return res.data;
}

export async function upsertUser(user) {
  const res = await axios.post(`${API_URL}/users`, user);
  return res.data;
}
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

export async function addTaskComment(id, comment) {
  const res = await axios.post(`${API_URL}/tasks/${id}/comments`, comment);
  return res.data;
}

// Also provide a default export to be resilient to different import styles
export default {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
};
