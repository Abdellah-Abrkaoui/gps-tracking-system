import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import locations from "../assets/data/locations.js";
import devices from "../assets/data/devices.js";
import users from "../assets/data/usersDummy.js";

// Simulated logged-in user (replace with real auth later)
const currentUser = users[3]; // user1 (not admin)

// Default icon fix
// import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icon based on status (mocked here)
const createCarIcon = (status = "active") => {
  const color = status === "active" ? "#10b981" : "#ef4444";

  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="white" stroke="${color}" stroke-width="2"/>
      <circle cx="20" cy="20" r="10" fill="${color}"/>
      <path d="M15 15 L25 15 L28 20 L28 25 L25 25 L25 27 L23 27 L23 25 L17 25 L17 27 L15 27 L15 25 L12 25 L12 20 Z" fill="#333"/>
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Auto-center component
const MapCenter = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(
        positions.map((loc) => [loc.latitude, loc.longtitude])
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [positions, map]);

  return null;
};

function CarMap() {
  // Filter based on role
  const visibleDeviceIds = currentUser.is_admin
    ? devices.map((d) => d.id)
    : currentUser.devices;

  const visibleLocations = locations.filter((loc) =>
    visibleDeviceIds.includes(loc.device_id)
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[31.63, -8.0]}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visibleLocations.map((location) => {
          const device = devices.find((d) => d.id === location.device_id);
          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longtitude]}
              icon={createCarIcon("active")} // replace "active" with real status
            >
              <Popup>
                <div className="text-sm">
                  <strong>Device ID:</strong> {device.hardware_id}
                  <br />
                  <strong>Speed:</strong> {location.speed} km/h
                  <br />
                  <strong>Altitude:</strong> {location.altitude} m
                  <br />
                  <strong>Timestamp:</strong>{" "}
                  {new Date(location.timestamp).toLocaleString()}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapCenter positions={visibleLocations} />
      </MapContainer>

      <div className="absolute bottom-2 left-2 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow-md z-[1000]">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}

export default CarMap;
