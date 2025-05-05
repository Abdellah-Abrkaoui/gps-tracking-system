export const isLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const getUserRole = () => {
  return localStorage.getItem("role"); // admin or user
};

export const getUserId = () => {
  return localStorage.getItem("user Id"); // get user id
};

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  window.location.href = "/login"; // force redirect to login
};
