import React from "react";
import Speed from "@mui/icons-material/Speed";

const SpeedCard = ({ speed }) => {
  return (
    <div className="border p-4 rounded-md shadow-sm flex items-center justify-between">
      <div>
        <h4 className="text-sm text-gray-500">Mean Speed</h4>
        <p className="text-2xl font-bold">{speed} km/h</p>
      </div>
      <Speed className="text-violet-400" />
    </div>
  );
};

export default SpeedCard;
