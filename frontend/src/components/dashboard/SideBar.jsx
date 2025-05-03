// src/components/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import devices from "../../assets/data/devices";
import locations from "../../assets/data/locations";
import DeviceList from "./DeviceList";

const Sidebar = ({ onDeviceSelect }) => {
  const [search, setSearch] = useState("");
  const [minSpeed, setMinSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(140);

  // Merge devices with their latest location
  const mergedData = useMemo(() => {
    return devices.map((device) => {
      const loc = locations.find((l) => l.device_id === device.id);
      return {
        ...device,
        location: loc || { speed: 0, altitude: 0, timestamp: null },
      };
    });
  }, []);

  // Filter by search and speed
  const filtered = mergedData.filter((device) => {
    const matchSearch = device.hardware_id
      .toLowerCase()
      .includes(search.toLowerCase());
    const speed = device.location?.speed || 0;
    const matchSpeed = speed >= minSpeed && speed <= maxSpeed;
    return matchSearch && matchSpeed;
  });

  const resetFilters = () => {
    setSearch("");
    setMinSpeed(0);
    setMaxSpeed(140);
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Search and Filters - Fixed height section */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Device ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Speed range */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">
              Speed Range (km/h)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={minSpeed}
                onChange={(e) => setMinSpeed(Number(e.target.value))}
                placeholder="Min"
                className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="number"
                max="140"
                value={maxSpeed}
                onChange={(e) => setMaxSpeed(Number(e.target.value))}
                placeholder="Max"
                className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-700">Devices</h3>
      </div>

      {/* Device List Component */}
      <DeviceList devices={filtered} onDeviceSelect={onDeviceSelect} />
    </div>
  );
};

export default Sidebar;
