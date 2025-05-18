import axiosInstance from "../controllers/axiosController";

const licensePlateController = {
  getAlllicenseplate: async (limit, offset) => {
    try {
      const response = await axiosInstance.get(
        `/license-plate-history?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all license plate:",
        error.response?.data?.detail
      );
      throw new Error(
        error.response?.data?.detail || "Failed to fetch license palte"
      );
    }
  },
};

export default licensePlateController;

// Named exports for easier importing
export const getAllPlates = licensePlateController.getAlllicenseplate;
