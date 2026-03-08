import axios from 'axios';

// Dynamic API URL: detects environment and uses appropriate endpoint
// - Web browser: http://localhost:3001/api
// - Android emulator: http://10.0.2.2:3001/api (special Android emulator IP)
// - Production: Uses VITE_API_URL environment variable
const getApiUrl = () => {
  // Check if running in production (environment variable set)
  // Use VITE_API_URL when provided; otherwise fall back to the Render deployment URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // If building/running in production without a VITE_API_URL set at build time,
  // fall back to the public Render URL (includes /api suffix expected by frontend)
  if (import.meta.env.MODE === 'production') {
    return "https://vibecoding-wd29.onrender.com/api";
  }
  
  // Check if running in Android (Capacitor)
  const isAndroid = /android/i.test(navigator.userAgent);
  
  // For local development
  if (import.meta.env.MODE === "development") {
    return isAndroid ? "http://10.0.2.2:5001/api" : "http://localhost:5001/api";
  }
  
  // Fallback to localhost for web browser
  return "http://localhost:5001/api";
};

const API_URL = getApiUrl();

console.log('API URL:', API_URL); // Debug log to verify correct URL

// Note: For Netlify deployment, set VITE_API_URL environment variable in Netlify dashboard
// pointing to your deployed backend (e.g., https://your-backend.onrender.com/api)

export async function fetchUsers() {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
}

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
