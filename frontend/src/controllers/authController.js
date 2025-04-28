import axiosInstance from "../controllers/axiosController";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const login = async (username, password, navigate) => {
  try {
    const response = await axiosInstance.post("/auth", { username, password });
    if (response.status === 200) {
      const token = response.data.access_token;
      const decoded = jwtDecode(token);

      console.log("Decoded Token: ", decoded);

      const isAdmin = decoded.is_admin;
      const role = isAdmin ? "admin" : "user";

      localStorage.setItem("jwt", token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", role);
      setTimeout(() => {
        navigate("/");
      }, 1000);

      return { success: true }; // Good practice to return success
    }
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Invalid username or password!"
    );
    return {
      success: false,
      message: error.response?.data?.message || "Invalid username or password!",
    };
  }
};
