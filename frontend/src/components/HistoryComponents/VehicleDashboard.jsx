import React, { useState, useEffect } from "react";
import VehicleDropdown from "./VehicleDropDown";
import SpeedGraph from "./speedGraph";
import VehicleMap from "./VehicleMap";
import { Calendar, Clock, MapPin, Car, Gauge } from "lucide-react";

const VehicleDashboard = ({ vehicles }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with the first vehicle if available
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0]);
    }
  }, [vehicles, selectedVehicle]);

  const handleSelectVehicle = (vehicle) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedVehicle(vehicle);
      setIsLoading(false);
    }, 500);
  };

  const calculateStats = () => {
    if (!selectedVehicle) return null;

    const speeds = selectedVehicle.speedData.map((point) => point.speed);
    const avgSpeed =
      speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const maxSpeed = Math.max(...speeds);
    const distance =
      (speeds.reduce((sum, speed) => sum + speed, 0) / 3600) *
      (selectedVehicle.speedData.length * 60);

    const startTime = new Date(selectedVehicle.locationHistory[0].timestamp);
    const endTime = new Date(
      selectedVehicle.locationHistory[
        selectedVehicle.locationHistory.length - 1
      ].timestamp
    );
    const duration =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // in minutes

    return {
      avgSpeed: Math.round(avgSpeed),
      maxSpeed,
      distance: Math.round(distance * 10) / 10,
      startTime,
      endTime,
      duration: Math.round(duration),
    };
  };

  const stats = selectedVehicle ? calculateStats() : null;

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vehicle History Tracker
        </h1>
        <p className="text-gray-600">
          Select a vehicle to view its speed and location history.
        </p>
      </header>

      {/* Vehicle Selection */}
      <div className="mb-6">
        <VehicleDropdown
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={handleSelectVehicle}
        />
      </div>

      {selectedVehicle ? (
        <div
          className={`transition-opacity duration-300 ${
            isLoading ? "opacity-50" : "opacity-100"
          }`}
        >
          {/* Vehicle Info Card */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Car className="h-8 w-8 text-blue-800" />
                </div>
                <div>
                  <p className="text-black font-bold">
                    {selectedVehicle.licensePlate}
                  </p>
                </div>
              </div>

              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto mt-4 md:mt-0">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center mb-1">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Duration</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {stats.duration} hours
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center mb-1">
                      <Gauge className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Avg Speed</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {stats.avgSpeed} km/h
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center mb-1">
                      <Gauge className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Max Speed</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {stats.maxSpeed.toFixed(2)} km/h
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Distance</span>
                    </div>
                    <p className="text-lg font-semibold">{stats.distance} km</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SpeedGraph data={selectedVehicle.speedData} />
            <VehicleMap
              locationHistory={selectedVehicle.locationHistory}
              vehicleName={selectedVehicle.licensePlate}
            />
          </div>

          {/* Journey Details */}
          {stats && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Journey Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-800 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="font-medium">
                      {stats.startTime.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-800 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">End Time</p>
                    <p className="font-medium">
                      {stats.endTime.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <p className="text-lg text-blue-800">
            Please select a vehicle to view its history.
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleDashboard;
