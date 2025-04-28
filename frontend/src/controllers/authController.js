import axiosInstance from "../controllers/axiosController";

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post("/auth", { username, password });
    if (response.status === 200) {
      localStorage.setItem("jwt", response.data.access_token);
      localStorage.setItem("isLoggedIn", "true");
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Login failed!" };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.response?.data?.message || "Invalid username or password!",
    };
  }
};
