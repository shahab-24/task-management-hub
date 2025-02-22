import axios from "axios";

export const API_URL = "http://localhost:5000"; // Ensure this matches your backend

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // ✅ Enables cookies in all requests
});

export default axiosInstance;
