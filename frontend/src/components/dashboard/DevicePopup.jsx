import { CarIcon, Clock, Gauge, MapPin } from "lucide-react";
import React from "react";

function DevicePopup({ device, location }) {
  return (
    <div className="bg-white rounded-lg shadow-md px-3 py-2 text-sm w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-56">
      <div className="flex items-center gap-2 mb-1">
        <CarIcon className="h-4 w-4 text-violet-500" />
        <p className="text-gray-600 font-medium break-words text-[10px] lg:text-[16px]">
          {device.hardware_id}
        </p>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <Gauge className="h-4 w-4 text-violet-500" />
        <p className="text-gray-600">{location.speed} km/h</p>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-violet-500" />
        <p className="text-gray-600">{location.altitude} m</p>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-violet-500" />
        <p className="text-gray-600 break-words">
          {new Date(location.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default DevicePopup;
