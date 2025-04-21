import React, { useEffect, useState } from "react";
import vehicles from "../assets/data/carsDummy.js";
import AlertBox from "./AlertBox";

const AlertsContainer = () => {
  const [alertVehicles, setAlertVehicles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const speeding = vehicles.filter((v) => v.speed > 100);
      setAlertVehicles(speeding);
    }, 1000); // check every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      <h3 className="font-medium text-gray-700 mb-2">🚨 Speed Alerts</h3>
      {alertVehicles.length === 0 ? (
        <p className="text-sm text-gray-400">
          Everything is Good , there is no Speed Alerts
        </p>
      ) : (
        alertVehicles.map((v) => (
          <AlertBox key={v.id} vehicleId={v.id} name={v.name} speed={v.speed} />
        ))
      )}
    </div>
  );
};

export default AlertsContainer;
