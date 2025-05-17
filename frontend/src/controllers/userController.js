import axiosInstance from "../controllers/axiosController";

const userController = {
  getAllUsers: async (limit, offset) => {
    try {
      const response = await axiosInstance.get(
        `/users?limit=${limit}&offset=${offset}`
      );
      return response.data; // { items, total, limit, offset }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.detail);
      throw new Error(error.response?.data?.detail || "Failed to fetch users");
    }
  },
  

  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error.response?.data?.detail);
      throw new Error(error.response?.data?.detail || "Failed to create user");
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(
        `Error updating user with ID ${userId}:`,
        error.response?.data?.detail
      );
      throw new Error(error.response?.data?.detail || "Failed to update user");
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting user with ID ${userId}:`,
        error.response?.data?.detail
      );
      throw new Error(error.response?.data?.detail || "Failed to delete user");
    }
  },
};

export default userController;

export const getAllUsers = userController.getAllUsers;
export const addUser = userController.createUser;
export const editSingleUser = userController.updateUser;
export const deleteUser = userController.deleteUser;
