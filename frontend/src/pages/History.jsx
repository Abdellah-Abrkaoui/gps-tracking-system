import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Card, CardContent } from "../components/Card";

const CAR_LIST = [
  { id: "Vehicle #1", label: "Vehicle #1" },
  { id: "Vehicle #2", label: "Vehicle #2" },
  { id: "Vehicle #3", label: "Vehicle #3" },
  { id: "Vehicle #4", label: "Vehicle #4" },
  { id: "Vehicle #5", label: "Vehicle #5" },
  { id: "Vehicle #6", label: "Vehicle #6" },
  { id: "Vehicle #7", label: "Vehicle #7" },
  { id: "Vehicle #8", label: "Vehicle #8" },
  { id: "Vehicle #9", label: "Vehicle #9" },
  { id: "Vehicle #10", label: "Vehicle #10" },
];

const History = () => {
  const [selectedCar, setSelectedCar] = useState(CAR_LIST[0].id);
  const [speedData, setSpeedData] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  // random data , need Api Calls for integration
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString("fr-FR", {
        hour12: false,
      });
      setSpeedData((prev) => [
        ...prev.slice(-20),
        Math.floor(Math.random() * 100) + 20,
      ]);
      setTimeLabels((prev) => [...prev.slice(-20), currentTime]);
    }, 2000); // Every 2s

    return () => clearInterval(interval);
  }, [selectedCar]);

  const handleCarChange = (e) => {
    setSelectedCar(e.target.value);
    setSpeedData([]);
    setTimeLabels([]);
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="pattern-background flex flex-1 flex-col p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* Card - Vehicle Selector */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-2">Trip History</h2>
              <p className="text-gray-600 mb-4">
                Select a vehicle to view its data.
              </p>
              <div className="flex items-center gap-3">
                <label htmlFor="car-select" className="font-medium">
                  Vehicle :
                </label>
                <select
                  id="car-select"
                  value={selectedCar}
                  onChange={handleCarChange}
                  className="border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CAR_LIST.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.label}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Card - Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Speed History · {selectedCar}
              </h3>
              <p className="text-gray-500 mb-6">
                Real-time display of previous speeds (updated every 15 seconds)
              </p>

              <CardContent className="h-72">
                {speedData.length > 0 ? (
                  <LineChart
                    xAxis={[{ scaleType: "point", data: timeLabels }]}
                    series={[
                      {
                        data: speedData,
                        label: "Vitesse (km/h)",
                        color: "#3B82F6",
                      },
                    ]}
                    height={250}
                  />
                ) : (
                  <div className="text-center text-gray-400 mt-10">
                    No data available.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
