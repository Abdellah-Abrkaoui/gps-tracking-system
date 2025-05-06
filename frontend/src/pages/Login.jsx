import React, { useState } from "react";
import { DirectionsCar as CarIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../controllers/authController";
import loginThumbnail from "../assets/images/login-thumbnails.png"; // Import your image

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Username and Password are required!");
      return;
    }

    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-400">
      {/* Background thumbnail image */}
      <img
        src={loginThumbnail}
        alt="Login Thumbnail"
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
      />

      {/* Content overlay */}
      <ToastContainer />
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <CarIcon className="text-blue-600" style={{ fontSize: "48px" }} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          GPS CAR TRACKING SYSTEM
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
