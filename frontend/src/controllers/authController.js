// this a controller pattern for the API call
// import axios from "axios";
import axios from 'axios';
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"; // this will  be change based on backend url
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // <<< Mets ton vrai backend ici
  
});


axiosInstance.interceptors.request.use(
  config => {

    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
