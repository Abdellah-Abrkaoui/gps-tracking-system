// this a controller pattern for the API call
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"; // this will  be change based on backend url

export const loginUser = async () => {
  try {
    console.log("login successfully done");
  } catch (error) {
    console.error("Login failed:", error);
  }
};
