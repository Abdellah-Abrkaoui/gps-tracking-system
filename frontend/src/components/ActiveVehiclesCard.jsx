import React from "react";
import DirectionsCarFilled from "@mui/icons-material/DirectionsCarFilled";

const ActiveVehiclesCard = ({ count }) => {
  return (
    <div className="border p-4 rounded-md shadow-sm flex items-center justify-between">
      <div>
        <h4 className="text-sm text-gray-500">Actif Vehicles</h4>
        <p className="text-2xl font-bold">{count}/10</p>
      </div>
      <DirectionsCarFilled className="text-blue-600" />
    </div>
  );
};

export default ActiveVehiclesCard;
