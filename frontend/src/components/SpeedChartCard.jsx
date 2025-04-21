import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import vehicles from "../assets/data/carsDummy"; // path might vary

const SpeedChartCard = () => {
  const [speedData, setSpeedData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalSpeed = vehicles.reduce((acc, v) => acc + v.speed, 0);
      const averageSpeed = Math.round(totalSpeed / vehicles.length);

      const now = new Date();
      const timeLabel = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setSpeedData((prev) => [...prev.slice(-5), averageSpeed]);
      setXLabels((prev) => [...prev.slice(-5), timeLabel]);

      setTick((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h4 className="text-sm text-gray-500 mb-2">Mean Speed (5s)</h4>
      <LineChart
        xAxis={[{ scaleType: "point", data: xLabels }]}
        series={[
          {
            data: speedData,
            color: "#10b981",
            label: "Mean Speed",
          },
        ]}
        tooltip={{ trigger: "axis" }}
        height={200}
      />
    </div>
  );
};

export default SpeedChartCard;
