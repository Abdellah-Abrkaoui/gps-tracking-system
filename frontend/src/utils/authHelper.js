export const isLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const getUserRole = () => {
  return localStorage.getItem("role"); // admin or user
};

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  window.location.href = "/login"; // force redirect to login
};
