import React, { useEffect, useState, useMemo } from "react";
import CarMap from "../components/dashboard/CarMap.jsx";
import Sidebar from "../components/dashboard/SideBar";
import VehicleCard from "../components/dashboard/VehicleCard";
import { getAllDevicespage } from "../controllers/DevicesController.js";
import { getAllLocations } from "../controllers/locController.js";
import LoadingSpinner from "../components/dashboard/LoadingSpinner.jsx";

const Dashboard = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [minSpeed, setMinSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(140);

  const fetchAllLocations = async () => {
    const limit = 50;
    let offset = 0;
    let allLocations = [];
    let hasMore = true;
    const seenTimestamps = new Set(); // prevent duplicate loops
    const MAX_PAGES = 20; // safety limit (adjust if needed)
    let pageCount = 0;

    while (hasMore && pageCount < MAX_PAGES) {
      const response = await getAllLocations(limit, offset);
      const currentPage = response.items || [];

      // Stop if the same data is being returned (infinite loop protection)
      const uniqueNewData = currentPage.filter(
        (loc) => !seenTimestamps.has(loc.id || loc.timestamp)
      );

      if (uniqueNewData.length === 0) {
        console.warn("Duplicate data detected — stopping early.");
        break;
      }

      uniqueNewData.forEach((loc) =>
        seenTimestamps.add(loc.id || loc.timestamp)
      );

      allLocations = [...allLocations, ...uniqueNewData];

      hasMore = currentPage.length === limit;
      offset += limit;
      pageCount++;
      console.log(`Page ${pageCount + 1}: fetched ${currentPage.length} items`);
    }

    return allLocations;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const deviceLimit = 100;
        const deviceOffset = 0;

        // Step 1: Load all devices
        const devicesResponse = await getAllDevicespage(
          deviceLimit,
          deviceOffset
        );
        const allDevices = devicesResponse.items || [];
        setDevices(allDevices);

        // Step 2: Load all locations (paginated)
        const allLocations = await fetchAllLocations();

        // Step 3: Build map of latest location per device
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

        // Step 4: Store the latest locations
        const latestLocations = Array.from(latestLocationMap.values());
        setLocations(latestLocations);

        // console.log("Devices:", allDevices);
        // console.log("Loaded Locations:", allLocations.length);
        // console.log("Latest Locations:", latestLocations.length);
        // console.log("Latest Locations:", latestLocations);
      } catch (error) {
        console.error("Error loading dashboard data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combine only devices that have latest locations
  const mergedData = useMemo(() => {
    return devices
      .map((device) => {
        const loc = locations.find((l) => l.device_id === device.id);
        if (!loc) return null;
        return { ...device, location: loc };
      })
      .filter(Boolean);
  }, [devices, locations]);

  // Apply search and speed filters
  const filteredDevices = useMemo(() => {
    return mergedData.filter((device) => {
      const matchSearch = device.hardware_id
        .toLowerCase()
        .includes(search.toLowerCase());
      const speed = device.location?.speed || 0;
      const matchSpeed = speed >= minSpeed && speed <= maxSpeed;
      return matchSearch && matchSpeed;
    });
  }, [mergedData, search, minSpeed, maxSpeed]);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) =>
      filteredDevices.some((dev) => dev.id === loc.device_id)
    );
  }, [locations, filteredDevices]);

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
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            <VehicleCard
              devices={filteredDevices}
              locations={filteredLocations}
            />
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
              devices={mergedData}
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
