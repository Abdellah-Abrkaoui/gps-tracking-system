import React, { useEffect, useState } from "react";
import VehicleDashboard from "../components/HistoryComponents/VehicleDashboard";
import deviceController from "../controllers/DevicesController";
import locController from "../controllers/locController";
import licensePlateController from "../controllers/licensePlateController";

const History = () => {
  const userId = localStorage.getItem("userId");
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      setIsLoading(true);

      try {
        const [devices, licensePlates, allLocations] = await Promise.all([
          deviceController.getAllDevices(),
          licensePlateController.getAlllicenseplate(),
          locController.getAllLocations()
        ]);

        const latestLocationMap = new Map();
        for (const loc of allLocations) {
          const existing = latestLocationMap.get(loc.device_id);
          if (!existing || new Date(loc.timestamp) > new Date(existing.timestamp)) {
            latestLocationMap.set(loc.device_id, loc);
          }
        }

        const latestLicensePlateMap = new Map();
        for (const lp of licensePlates) {
          const existing = latestLicensePlateMap.get(lp.device_id);
          if (!existing || new Date(lp.created_at) > new Date(existing.created_at)) {
            latestLicensePlateMap.set(lp.device_id, lp);
          }
        }

        const assembledVehicles = devices.map(device => {
          const plate = latestLicensePlateMap.get(device.id);
          const location = latestLocationMap.get(device.id);

          if (!plate || !location) {
            return null; // Skip vehicles without license plates or locations
          }

          const locationHistory = allLocations
            .filter(loc => loc.device_id === device.id)
            .map(loc => ({
              latitude: loc.latitude,
              longitude: loc.longitude,
              timestamp: new Date(loc.timestamp).getTime(),
              speed: loc.speed ?? 0
            }));

          const speedData = locationHistory.map(loc => ({
            timestamp: loc.timestamp,
            speed: loc.speed
          }));

          return {
            id: device.id,
            year: plate?.start_date || "N/A",
            licensePlate: plate?.license_plate || "Unknown",
            lastLocation: location || null,
            locationHistory,
            speedData
          };
        }).filter(vehicle => vehicle !== null); // Filter out any null values

        setVehicles(assembledVehicles);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <VehicleDashboard vehicles={vehicles} />
      )}
    </div>
  );
};

export default History;
