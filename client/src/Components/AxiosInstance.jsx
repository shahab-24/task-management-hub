import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: 'https://backend-brown-one-68.vercel.app', // your API base URL
});

// Add an interceptor to attach the auth token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if the user is logged in and get the token from localStorage or context
    const token = localStorage.getItem('auth_token'); // or use a global state/context
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Make sure to export this axiosInstance so you can use it in your API calls
export default axiosInstance;
