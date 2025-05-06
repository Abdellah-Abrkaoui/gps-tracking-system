import axiosInstance from "../controllers/axiosController";

const licensePlateController = {
  getAlllicenseplate: async () => {
    try {
      const response = await axiosInstance.get("/license-plate-history");
      return response.data;
    } catch (error) {
      console.error("Error fetching all license plate:",error.response?.data?.detail);
      throw new Error(
        error.response?.data?.detail || "Failed to fetch license palte");
    }
  },

  getlicenseplateById: async (device_id) => {
    try {
      const response = await axiosInstance.get(`/license-plate-history/${device_id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching license palte with ID ${device_id}:",error.response?.data?.detail);
      throw new Error(error.response?.data?.detail || "Failed to fetch license palte");
    }
  },
};

export default licensePlateController;

// Named exports for easier importing
export const getAllPlates = licensePlateController.getAlllicenseplate;
export const getPlateById = licensePlateController.getlicenseplateById;