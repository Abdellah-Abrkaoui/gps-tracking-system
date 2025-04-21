import React from "react";
import TaxiAlert from "@mui/icons-material/TaxiAlert";

const AlertsCard = ({ count }) => {
  return (
    <div className="border p-4 rounded-md shadow-sm flex items-center justify-between">
      <div>
        <h4 className="text-sm text-gray-500">Today Alertes</h4>
        <p className="text-2xl font-bold text-red-600">{count}</p>
      </div>
      <TaxiAlert className="text-red-600" />
    </div>
  );
};

export default AlertsCard;
