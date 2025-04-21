import React from "react";

const AlertBox = ({ vehicleId, name, speed }) => {
  return (
    <div className="border border-red-300 bg-red-50 p-4 rounded-md shadow-sm">
      <h4 className="text-sm font-medium text-red-700">⚠️ High Speed Alert</h4>
      <p className="text-sm mt-1">
        {name} (ID: {vehicleId}) - {speed} km/h
      </p>
    </div>
  );
};

export default AlertBox;
