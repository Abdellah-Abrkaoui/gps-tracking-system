import React, { useEffect, useState, useMemo } from "react";
import CarMap from "../components/CarMap";
import Sidebar from "../components/dashboard/SideBar";
import VehicleCard from "../components/dashboard/VehicleCard";
import { getAllDevices } from "../controllers/DevicesController.js";
import { getAllLocations } from "../controllers/locController.js";

const Dashboard = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);

  const [search, setSearch] = useState("");
  const [minSpeed, setMinSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(140);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allDevices, allLocations] = await Promise.all([
          getAllDevices(),
          getAllLocations(),
        ]);

        setDevices(allDevices);

        // Keep only latest location per device
        const latestLocationMap = new Map();

        for (const loc of allLocations) {
          const existing = latestLocationMap.get(loc.device_id);
          if (
            !existing ||
            new Date(loc.timestamp) > new Date(existing.timestamp)
          ) {
            latestLocationMap.set(loc.device_id, loc);
          }
        }

        setLocations(Array.from(latestLocationMap.values()));
      } catch (error) {
        console.error("Error loading dashboard data:", error.message);
      }
    };

    fetchData();
  }, []);

  const mergedData = useMemo(() => {
    return devices.map((device) => {
      const loc = locations.find((l) => l.device_id === device.id);
      return {
        ...device,
        location: loc || { speed: 0 },
      };
    });
  }, [devices, locations]);

  const filteredDevices = mergedData.filter((device) => {
    const matchSearch = device.hardware_id
      .toLowerCase()
      .includes(search.toLowerCase());
    const speed = device.location?.speed || 0;
    const matchSpeed = speed >= minSpeed && speed <= maxSpeed;
    return matchSearch && matchSpeed;
  });

  const filteredLocations = locations.filter((loc) =>
    filteredDevices.some((dev) => dev.id === loc.device_id)
  );

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  };

  const handleResetFilters = () => {
    setSearch("");
    setMinSpeed(0);
    setMaxSpeed(140);
  };

  return (
    <div className="p-2 lg:h-[92vh] flex flex-col lg:flex-row gap-2">
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <VehicleCard devices={filteredDevices} locations={filteredLocations} />
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-md">
          <CarMap
            selectedDevice={selectedDevice}
            devices={filteredDevices}
            locations={filteredLocations}
          />
        </div>
      </div>

      <div className="w-full lg:w-[25%] flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        <Sidebar
          devices={devices}
          locations={locations}
          search={search}
          minSpeed={minSpeed}
          maxSpeed={maxSpeed}
          onSearchChange={setSearch}
          onMinSpeedChange={setMinSpeed}
          onMaxSpeedChange={setMaxSpeed}
          onResetFilters={handleResetFilters}
          onDeviceSelect={handleDeviceSelect}
        />
      </div>
    </div>
  );
};

export default Dashboard;
