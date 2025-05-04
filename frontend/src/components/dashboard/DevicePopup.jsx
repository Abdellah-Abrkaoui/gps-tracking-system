import { CarIcon, Clock, Gauge, MapPin } from "lucide-react";
import React from "react";

function DevicePopup({ device, location }) {
  return (
    <div className="bg-white rounded-xl shadow-lg px-4 py-3 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-64 border border-gray-100 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-violet-100 rounded-lg">
          <CarIcon className="h-4 w-4 text-violet-600" />
        </div>
        <p className="text-gray-800 font-semibold break-words text-xs lg:text-sm">
          {device.hardware_id}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Gauge className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-gray-700 text-sm">
            <span className="font-medium">
              {location.speed ? location.speed.toFixed(2) : "0.00"} km/h
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 rounded-lg">
            <MapPin className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-gray-700 text-sm">
            <span className="font-medium">
              {location.altitude ? location.altitude.toFixed(2) : "0.00"} m
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 rounded-lg">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-gray-700 text-sm break-words">
            {new Date(location.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DevicePopup;
