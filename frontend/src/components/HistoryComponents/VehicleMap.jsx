import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin } from 'lucide-react';

const VehicleMap = ({ locationHistory, vehicleName, className = '' }) => {
  const [positions, setPositions] = useState([]);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (locationHistory.length > 0) {
      const newPositions = locationHistory.map(loc => [loc.latitude, loc.longitude]);
      setPositions(newPositions);

      const midIndex = Math.floor(locationHistory.length / 2);
      setCenter([locationHistory[midIndex].latitude, locationHistory[midIndex].longitude]);

      if (locationHistory.length > 1) {
        const latDiff = Math.abs(
          Math.max(...locationHistory.map(loc => loc.latitude)) - 
          Math.min(...locationHistory.map(loc => loc.latitude))
        );
        const lngDiff = Math.abs(
          Math.max(...locationHistory.map(loc => loc.longitude)) - 
          Math.min(...locationHistory.map(loc => loc.longitude))
        );
        const maxDiff = Math.max(latDiff, lngDiff);
        
        if (maxDiff > 0.1) setZoom(10);
        else if (maxDiff > 0.05) setZoom(11);
        else if (maxDiff > 0.02) setZoom(12);
        else if (maxDiff > 0.01) setZoom(13);
        else setZoom(14);
      }
    }
  }, [locationHistory]);

  const startPoint = positions.length > 0 ? positions[0] : null;
  const endPoint = positions.length > 0 ? positions[positions.length - 1] : null;

  const blueOptions = { color: '#0d47a1', weight: 4, opacity: 0.8 };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Route Map</h2>
      <div className="h-[400px] z-0">
        {positions.length > 0 && (
          <MapContainer 
            center={center} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {positions.length > 1 && (
              <Polyline positions={positions} pathOptions={blueOptions} />
            )}
            
            {startPoint && (
              <Marker position={startPoint}>
                <Popup>
                  <strong>{vehicleName}</strong>
                  <br />
                  Starting point
                  <br />
                  <span className="text-xs">
                    {new Date(locationHistory[0].timestamp).toLocaleString()}
                  </span>
                </Popup>
              </Marker>
            )}
            
            {endPoint && (
              <Marker position={endPoint}>
                <Popup>
                  <strong>{vehicleName}</strong>
                  <br />
                  Ending point
                  <br />
                  <span className="text-xs">
                    {new Date(locationHistory[locationHistory.length - 1].timestamp).toLocaleString()}
                  </span>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default VehicleMap;
