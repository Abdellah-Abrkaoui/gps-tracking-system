import React from "react";
import { CarIcon, Clock, Gauge, MapPin } from "lucide-react";

const DeviceList = ({ devices, onDeviceSelect }) => {
  // Function to calculate time since last update
  const getTimeSinceUpdate = (timestamp) => {
    if (!timestamp) return "N/A";
    const now = new Date();
    const updated = new Date(timestamp);
    const seconds = Math.floor((now - updated) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex-1 overflow-y-auto mt-2">
      {devices.length > 0 ? (
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              onClick={() => onDeviceSelect(device)}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
            >
              {/* Device Header */}
              <div className="flex justify-between items-start">
                <h3 className="font-mono text-gray-900 flex gap-2 items-center ">
                  <CarIcon className="h-4 w-4 text-gray-400" />
                  {device.hardware_id}
                </h3>
              </div>

              {/* Stats Row */}
              <div className="mt-3 flex items-center space-x-4">
                {/* Speed */}
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-mono text-gray-900">
                    {device.location.speed
                      ? device.location.speed.toFixed(2)
                      : "0.00"}{" "}
                    km/h
                  </span>
                </div>

                {/* Altitude */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-mono text-gray-900">
                    {device.location.altitude
                      ? device.location.altitude.toFixed(2)
                      : "0.00"}{" "}
                    m
                  </span>
                </div>
              </div>

              {/* Last Update */}
              <div className="mt-3 flex items-center text-xs text-gray-500 gap-2">
                <Clock className="h-3 w-3 text-gray-400" />
                Updated {getTimeSinceUpdate(device.location.timestamp)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center py-4">
          No matching devices
        </div>
      )}
    </div>
  );
};

export default DeviceList;
