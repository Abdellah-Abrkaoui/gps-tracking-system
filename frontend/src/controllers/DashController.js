// import axios from "axios";
import axios from 'axios';
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"; // this will  be change based on backend url
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});


axiosInstance.interceptors.request.use(
  config => {

    const token = localStorage.getItem('jwt');
    console.log("Token:", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


// Fonction pour récupérer la vitesse moyenne
export const fetchAverageSpeed = async () => {
  try {
    const response = await axiosInstance.get("/locations");
    const locations = response.data;

    if (Array.isArray(locations) && locations.length > 0) {
      const totalSpeed = locations.reduce((acc, loc) => acc + (loc.speed || 0), 0);
      return Math.round(totalSpeed / locations.length);
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Erreur dans fetchAverageSpeed:", error);
    if (error.response && error.response.status === 401) {
      alert("Authentication failed. Please log in again.");
    }
    return 0;
  }
};

export default axiosInstance;
