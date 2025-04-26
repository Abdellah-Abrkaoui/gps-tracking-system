import React from "react";
import CarMap from "../components/CarMap";
import vehicles from "../assets/data/carsDummy";
import ActiveVehiclesCard from "../components/ActiveVehiclesCard";
import AlertsCard from "../components/AlertsCard";
import SpeedCard from "../components/SpeedCard";
import AlertsContainer from "../components/AlertsContainer";
import SpeedChartCard from "../components/SpeedChartCard";

const Dashboard = () => {
  const activeVehicles = vehicles.length;
  const alertsToday = 4;
  const averageSpeed = Math.round(
    vehicles.reduce((acc, v) => acc + v.speed, 0) / activeVehicles
  );
  return (
    <div className="p-4 h-full flex justify-between gap-3">
      <div className="w-[70%] h-[85vh] bg-white rounded-lg shadow-md">
        <CarMap />
      </div>

      <div className="w-[30%] p-4 bg-white rounded-lg shadow-md flex flex-col gap-4">
        <ActiveVehiclesCard count={activeVehicles} />
        <AlertsCard count={alertsToday} />
        <SpeedCard speed={averageSpeed} />
        <SpeedChartCard />
        <AlertsContainer />
      </div>
    </div>
  );
};

export default Dashboard;
