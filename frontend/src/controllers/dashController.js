import axiosInstance from "../controllers/axiosController";


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
