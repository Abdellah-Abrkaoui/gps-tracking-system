import axiosInstance from "../controllers/axiosController";

const locController = {
  getAllLocations: async () => {
    try {
      const response = await axiosInstance.get("/locations");
      return response.data;
    } catch (error) {
      console.error("Error fetching all locations:", error.response?.data?.detail);
      throw new Error(error.response?.data?.detail || "Failed to fetch locations");
    }
  },

  
 
};

export default locController;

export const getAllLocations = locController.getAllLocations;
