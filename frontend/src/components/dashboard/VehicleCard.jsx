import React from "react";
import { Car, Clock, Gauge } from "lucide-react";

function VehicleCard({ devices, locations }) {
  const totalVehicles = devices.length;

  const speeds = locations
    .map((loc) => loc.speed)
    .filter((speed) => typeof speed === "number");

  const averageSpeed =
    speeds.length > 0
      ? Math.round(speeds.reduce((sum, s) => sum + s, 0) / speeds.length)
      : 0;

  const mostRecentUpdate =
    locations.length > 0
      ? new Date(
          Math.max(
            ...locations.map((loc) => new Date(loc.received_at).getTime())
          )
        )
      : new Date();

  return (
    <div className="flex flex-wrap gap-4 p-2 pt-1">
      {/* Total Vehicles */}
      <div className="flex-1 min-w-[250px] p-4 rounded-lg shadow-md bg-white text-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium opacity-75">Total Vehicles</p>
            <h3 className="text-2xl font-bold">{totalVehicles}</h3>
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-blue-700">
            <Car size={24} />
          </div>
        </div>
      </div>

      {/* Average Speed */}
      <div className="flex-1 min-w-[250px] p-4 rounded-lg shadow-md bg-white text-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium opacity-75">Average Speed</p>
            <h3 className="text-2xl font-bold">{averageSpeed} km/h</h3>
          </div>
          <div className="p-3 rounded-full bg-green-100 text-green-700">
            <Gauge size={24} />
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-600 h-1.5 rounded-full"
            style={{ width: `${Math.min(100, averageSpeed / 1.5)}%` }}
          ></div>
        </div>
      </div>

      {/* Last Update */}
      <div className="flex-1 min-w-[250px] p-4 rounded-lg shadow-md bg-white text-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium opacity-75">Last Update</p>
            <h3 className="text-lg font-bold">
              {mostRecentUpdate.toLocaleTimeString()}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-purple-100 text-purple-700">
            <Clock size={24} />
          </div>
        </div>
        <p className="mt-2 text-sm opacity-75">
          {mostRecentUpdate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default VehicleCard;
