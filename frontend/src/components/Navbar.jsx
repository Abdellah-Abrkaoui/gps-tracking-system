import React, { useState, useEffect } from "react";
import {
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 text-black border-b-1 border-blue-200 relative">
      {/* Left side */}
      <div className="flex items-center gap-2">
        <a href="/" className="flex items-center gap-2">
          <CarIcon className="text-3xl text-[#1E3A8A]" />
          <span className="text-xl font-bold text-[#1E3A8A]">Cars Tracker</span>
        </a>
      </div>

      {/* Middle - hidden on mobile */}
      <div className="hidden md:block text-lg font-medium">
        GPS Cars Tracking Systems
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-sm italic">{formattedDate}</span>
        <span className="text-sm font-bold">{formattedTime}</span>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
            aria-label="Profile menu"
          >
            <PersonIcon className="text-2xl cursor-pointer" />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              onMouseLeave={closeDropdown}
            >
              <a
                href="/"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
              >
                <SettingsIcon className="mr-2" fontSize="small" />
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
              >
                <LogoutIcon className="mr-2" fontSize="small" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
