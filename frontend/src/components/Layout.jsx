import React from "react";
import Navbar from "./Navbar";
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[60px] bg-white border-r border-blue-200 flex flex-col items-center py-4 space-y-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-[#1E3A8A] bg-blue-50"
                  : "text-gray-600 hover:text-[#1E3A8A] hover:bg-blue-50"
              }`
            }
          >
            <DashboardIcon fontSize="small" />
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-[#1E3A8A] bg-blue-50"
                  : "text-gray-600 hover:text-[#1E3A8A] hover:bg-blue-50"
              }`
            }
          >
            <HistoryIcon fontSize="small" />
          </NavLink>
        </div>

        {/* Content area - changes based on route */}
        <main className="flex-1 bg-gray-50 overflow-auto">
          <Outlet /> {/* This will render either Dashboard or History */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
