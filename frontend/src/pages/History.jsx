
import React, {useEffect, useState } from "react";
import VehicleDashboard from "../components/HistoryComponents/VehicleDashboard";



const History = () => {
  const [vehicles, setvehicles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {

    setIsLoading(true);
    // #TODO : FETCH DATA FROM BACKEND
    
    setvehicles(mockVehicles);
    setIsLoading(false);
   
  }
  , []);

  return (
    <div>
      <div className="container mx-auto p-4">
        <VehicleDashboard vehicles={mockVehicles} />
      </div>
    </div>
  )
}

export default History

// #TODO : REMOVE THIS MOCK DATA AND USE THE API TO FETCH DATA

// generatPath function to create a path between two points addiha f controller
const generatePath = (startLat, startLng, endLat, endLng, points) => {
  const path = [];
  const startTime = Date.now() - points * 60000; // One point per minute

  for (let i = 0; i < points; i++) {
    const ratio = i / (points - 1);
    const lat = startLat + (endLat - startLat) * ratio + (Math.random() - 0.5) * 0.005;
    const lng = startLng + (endLng - startLng) * ratio + (Math.random() - 0.5) * 0.005;
    path.push({
      latitude: lat,
      longitude: lng,
      timestamp: startTime + i * 60000
    });
  }
  return path;
};

// Helper function to generate speed data
const generateSpeedData = (points) => {
  const data = [];
  const startTime = Date.now() - points * 60000;
  let lastSpeed = 30 + Math.random() * 30;

  for (let i = 0; i < points; i++) {
    const changeAmount = (Math.random() - 0.5) * 10;
    lastSpeed = Math.max(5, Math.min(130, lastSpeed + changeAmount));

    data.push({
      timestamp: startTime + i * 60000,
      speed: Math.round(lastSpeed)
    });
  }
  return data;
};

const mockVehicles = [
  {
    id: "v1",
    name: "Tesla Model 3",
    model: "Model 3",
    year: 2023,
    licensePlate: "EV-123",
    speedData: generateSpeedData(30),
    locationHistory: generatePath(37.7749, -122.4194, 37.8044, -122.2711, 30) // SF to Berkeley
  },
  {
    id: "v2",
    name: "Toyota Camry",
    model: "Camry",
    year: 2022,
    licensePlate: "TCY-456",
    speedData: generateSpeedData(25),
    locationHistory: generatePath(34.0522, -118.2437, 34.1478, -118.1445, 25) // LA to Pasadena
  },
  {
    id: "v3",
    name: "Ford F-150",
    model: "F-150",
    year: 2021,
    licensePlate: "FFT-789",
    speedData: generateSpeedData(35),
    locationHistory: generatePath(40.7128, -74.0060, 40.7831, -73.9712, 35) // NYC to Central Park
  },
  {
    id: "v4",
    name: "Honda Civic",
    model: "Civic",
    year: 2023,
    licensePlate: "HC-101",
    speedData: generateSpeedData(28),
    locationHistory: generatePath(41.8781, -87.6298, 42.0451, -87.6877, 28) // Chicago to Evanston
  },
  {
    id: "v5",
    name: "BMW X5",
    model: "X5",
    year: 2022,
    licensePlate: "BMX-555",
    speedData: generateSpeedData(32),
    locationHistory: generatePath(33.7490, -84.3880, 33.9526, -84.5499, 32) // Atlanta to Marietta
  }
];
