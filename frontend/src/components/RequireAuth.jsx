import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/authHelper";

const RequireAuth = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default RequireAuth;
