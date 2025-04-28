import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// Add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const userController = {
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  },
};

export default userController;

export const getAllUsers = userController.getAllUsers;
export const getSingleUser = userController.getUserById;
export const addUser = userController.createUser;
export const editSingleUser = userController.updateUser;
export const deleteUser = userController.deleteUser;
