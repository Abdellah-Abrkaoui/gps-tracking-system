import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SpeedGraph = ({ data, className = '' }) => {
  // Format the timestamp to a readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Format the y-axis ticks (speed)
  const formatSpeed = (speed) => `${speed} km/h`;

  // Create a proper data array for the chart with formatted timestamps
  const chartData = data.map((point) => ({
    ...point,
    formattedTime: formatTime(point.timestamp)
  }));

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Speed History</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="formattedTime" 
              stroke="#64748b" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tickFormatter={formatSpeed} 
              stroke="#64748b" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none', 
                borderRadius: '0.375rem', 
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value) => [`${value} km/h`, 'Speed']}
              labelFormatter={(time) => `Time: ${time}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#0d9488"
              strokeWidth={2}
              dot={{ r: 2, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#0d9488' }}
              name="Speed (km/h)"
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpeedGraph;
