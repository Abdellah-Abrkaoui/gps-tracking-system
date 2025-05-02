import React from "react";
import CarMap from "../components/CarMap";
import VehicleStatsCards from "../components/dashboard/VehicleCard";

const Dashboard = () => {
  return (
    <div className="p-2 h-full flex flex-col lg:flex-row gap-2">
      {/* Left Main Section */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Top Stats Cards */}
        <VehicleStatsCards />

        {/* Map */}
        <div className="h-[70vh] bg-white rounded-lg shadow-md">
          <CarMap />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[25%] h-[90vh] bg-white rounded-lg shadow-md">
        {/* Add your sidebar content here */}
        <div className="p-4 text-gray-700 font-medium">Sidebar content...</div>
      </div>
    </div>
  );
};

export default Dashboard;
