// import axios from 'axios'

// const axiosInstance = axios.create({
//         baseURL: API_URL,
//         withCredentials: true, // Ensures cookies are sent with requests
//     });

// export  const API_URL = "https://backend-brown-one-68.vercel.app/tasks"

// // tasks creating funtion
// export const createTasks = async (task) => {
//         const res = await axios.post(API_URL, task)
//         return res.data
// }

// export const getTasks = async() => {
// const res = await axios.get(API_URL)
// return res.data
// }

// export const updateTasks = async(id, updates) => {
//         const res = await axios.put(`${API_URL}/${id}`, updates)
//         return res.data
// }

// export const deleteTasks = async(id)=> {
//         await axios.delete(`${API_URL}/${id}`)
// }

// export const reorderTasks = async(updatedTasks) => {
//         await axios.put(`${API_URL}/reorder`, {updatedTasks})

// }

// export default API_URL;

import axios from "axios";

export const API_URL = "https://backend-brown-one-68.vercel.app";

// Axios instance with credentials enabled
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Tasks creating function
export const createTasks = async (task) => {
  const res = await axiosInstance.post("/tasks", task);
  return res.data;
};

// Example using fetch
export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "GET",
    credentials: "include", // ✅ Ensures cookies are sent
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // ✅ Ensure token is included
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export const updateTasks = async (id, updates) => {
  const res = await axiosInstance.put(`/tasks/${id}`, updates);
  return res.data;
};

export const deleteTasks = async (id) => {
  await axiosInstance.delete(`/tasks/${id}`);
};

export const reorderTasks = async ({ taskId, newCategory, newIndex }) => {
  const res = await axiosInstance.put("/tasks/reorder", {
    taskId,
    newCategory,
    newIndex,
  });
  return res.data;
};

export const getActivityLogs = async () => {
  const response = await fetch(
    "https://backend-brown-one-68.vercel.app/tasks/activity"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch activity logs");
  }
  return response.json();
};

export const logActivity = async (message) => {
  const response = await fetch(
    "https://backend-brown-one-68.vercel.app/tasks/activity",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to log activity");
  }

  return response.json();
};

export default API_URL;
