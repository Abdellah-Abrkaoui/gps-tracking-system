import axiosInstance from "../controllers/axiosController";

const deviceController = {
  getAllDevices: async () => {
    try {
      const response = await axiosInstance.get("/devices");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all devices:",
        error.response?.data?.detail
      );
      throw new Error(
        error.response?.data?.detail || "Failed to fetch devices"
      );
    }
  },

  getDeviceById: async (deviceId) => {
    try {
      const response = await axiosInstance.get(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching device with ID ${deviceId}:`,
        error.response?.data?.detail
      );
      throw new Error(error.response?.data?.detail || "Failed to fetch device");
    }
  },

  createDevice: async (deviceData) => {
    try {
      const response = await axiosInstance.post("/devices", deviceData);
      return response.data;
    } catch (error) {
      console.error("Error creating device:", error.response?.data?.detail);
      throw new Error(
        error.response?.data?.detail || "Failed to create device"
      );
    }
  },

  updateDevice: async (deviceId, deviceData) => {
    try {
      const response = await axiosInstance.patch(
        `/devices/${deviceId}`,
        deviceData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating device with ID ${deviceId}:`,
        error.response?.data?.detail
      );
      throw new Error(
        error.response?.data?.detail || "Failed to update device"
      );
    }
  },

  deleteDevice: async (deviceId) => {
    try {
      const response = await axiosInstance.delete(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting device with ID ${deviceId}:`,
        error.response?.data?.detail
      );
      throw new Error(
        error.response?.data?.detail || "Failed to delete device"
      );
    }
  },
};

export default deviceController;

export const getAllDevices = deviceController.getAllDevices;
export const getSingleDevice = deviceController.getDeviceById;
export const addDevice = deviceController.createDevice;
export const editSingleDevice = deviceController.updateDevice;
export const deleteDevice = deviceController.deleteDevice;
