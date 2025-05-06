import axiosInstance from "../controllers/axiosController";

const locationController = {
  getAllLocations: async () => {
    try {
      const response = await axiosInstance.get("/locations");
      return response.data;
    } catch (error) {
      console.error("Error fetching all locations:", error.response?.data?.detail);
      throw new Error(error.response?.data?.detail || "Failed to fetch locations");
    }
  },

  getLocationById: async (locationId) => {
    try {
      const response = await axiosInstance.get(`/locations/${locationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching location with ID ${locationId}:`, error.response?.data?.detail);
      throw new Error(error.response?.data?.detail || "Failed to fetch location");
    }
  },
  getLocationByDeviceId: async (deviceId) => {
    try {
      const response = await axiosInstance.get(`/locations/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching location with device ID ${deviceId}:`, error.response?.data?.detail);
      throw new Error(error.response?.data?.detail || "Failed to fetch location");
    }
   
  }
};

export default locationController;

// Optional named exports
export const getAllLocations = locationController.getAllLocations;
export const getLocationById = locationController.getLocationById;
export const getLocationByDeviceId = locationController.getLocationByDeviceId;
