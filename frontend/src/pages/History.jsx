import licensePlateController from "../controllers/licensePlateController";
import locController from "../controllers/locController";
import React, { useEffect, useState } from "react";
import VehicleDashboard from "../components/HistoryComponents/VehicleDashboard";

const History = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await licensePlateController.getAlllicenseplate();

        const vehiclesWithLocation = await Promise.all(
          data.map(async (vehicle) => {
            if (!vehicle.device_id) {
              console.warn("Missing device_id in vehicle:", vehicle);
              return null;
            }

            try {
              const locationData = await locController.getLocationByDeviceId(vehicle.device_id);
              return { ...vehicle, locationData };
            } catch (locationError) {
              console.warn(`No location for device_id ${vehicle.device_id}`);
              return null;
            }
          })
        );

        const validVehicles = vehiclesWithLocation.filter(v => v && v.locationData);

        setVehicles(validVehicles);

        if (validVehicles.length > 0) {
          const updates = validVehicles.map(v => new Date(v.locationData.timestamp));
          const latestUpdate = new Date(Math.max(...updates));
          setLastUpdate(latestUpdate);
        } else {
          setLastUpdate(null);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load vehicle data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {lastUpdate && (
        <div className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdate.toLocaleString()}
        </div>
      )}

      {vehicles.length > 0 ? (
        <VehicleDashboard vehicles={vehicles} />
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No vehicles with location data available
        </div>
      )}
    </div>
  );
};

export default History;
