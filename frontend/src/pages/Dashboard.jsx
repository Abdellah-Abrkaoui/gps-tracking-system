import React, { useState } from "react";
import CarMap from "../components/CarMap";
import Sidebar from "../components/dashboard/SideBar";
import VehicleCard from "../components/dashboard/VehicleCard";

const Dashboard = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  };

  return (
    <div className="p-2 lg:h-[92vh] flex flex-col lg:flex-row gap-2">
      {/* Left Main Section */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {/* Top Stats Cards */}
        <VehicleCard />
        {/* Map - Takes remaining space */}
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-md">
          <CarMap selectedDevice={selectedDevice} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[25%] flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        <Sidebar onDeviceSelect={handleDeviceSelect} />
      </div>
    </div>
  );
};

export default Dashboard;
