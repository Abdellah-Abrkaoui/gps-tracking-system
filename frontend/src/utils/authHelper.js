export const isLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const getUserRole = () => {
  return localStorage.getItem("role"); // admin or user
};
