import React, { useEffect, useState } from "react";
import VehicleDashboard from "../components/HistoryComponents/VehicleDashboard";
import deviceController from "../controllers/DevicesController";
import locController from "../controllers/locController";
import licensePlateController from "../controllers/licensePlateController";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";

const History = () => {
  const userId = localStorage.getItem("userId");
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all pages of data from a controller
  const fetchAllData = async (controllerFunc) => {
    const limit = 50;
    let offset = 0;
    let allItems = [];
    let hasMore = true;

    while (hasMore) {
      const res = await controllerFunc(limit, offset);
      const items = res.items || [];
      allItems = [...allItems, ...items];
      hasMore = items.length === limit;
      offset += limit;
    }

    return allItems;
  };

  // Main fetch function
  const fetchData = async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      const [devices, licensePlates, allLocations] = await Promise.all([
        fetchAllData(deviceController.getAllDevices),
        fetchAllData(licensePlateController.getAlllicenseplate),
        fetchAllData(locController.getAllLocations),
      ]);

      // Latest location per device
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

      // Latest license plate per device
      const latestLicensePlateMap = new Map();
      for (const lp of licensePlates) {
        const existing = latestLicensePlateMap.get(lp.device_id);
        if (
          !existing ||
          new Date(lp.created_at) > new Date(existing.created_at)
        ) {
          latestLicensePlateMap.set(lp.device_id, lp);
        }
      }

      const assembledVehicles = devices
        .map((device) => {
          const plate = latestLicensePlateMap.get(device.id);
          const location = latestLocationMap.get(device.id);

          if (!plate || !location) return null;

          const locationHistory = allLocations
            .filter((loc) => loc.device_id === device.id)
            .map((loc) => ({
              latitude: loc.latitude,
              longitude: loc.longitude,
              timestamp: new Date(loc.timestamp).getTime(),
              speed: loc.speed ?? 0,
            }));

          const speedData = locationHistory.map((loc) => ({
            timestamp: loc.timestamp,
            speed: loc.speed,
          }));

          return {
            id: device.id,
            year: plate?.start_date || "N/A",
            licensePlate: plate?.license_plate || "Unknown",
            lastLocation: location,
            locationHistory,
            speedData,
          };
        })
        .filter(Boolean); // remove nulls

      setVehicles(assembledVehicles);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // called once
  }, []); // only run on mount

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <VehicleDashboard vehicles={vehicles} />
      )}
    </div>
  );
};

export default History;
