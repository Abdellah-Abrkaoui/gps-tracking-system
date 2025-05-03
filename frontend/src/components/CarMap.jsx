import React, { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DevicePopup from "./dashboard/DevicePopup.jsx";
import locations from "../assets/data/locations.js";
import devices from "../assets/data/devices.js";
import users from "../assets/data/usersDummy.js";
import L from "leaflet";

// Default icon fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const createCarIcon = (status = "active", isSelected = false) => {
  const color = isSelected
    ? "#10b981"
    : status === "active"
    ? "#10b981"
    : "#ef4444";
  const stroke = isSelected ? "#10b981" : color;

  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="white" stroke="${stroke}" stroke-width="${
    isSelected ? 3 : 2
  }"/>
      <circle cx="20" cy="20" r="10" fill="${color}"/>
      <path d="M15 15 L25 15 L28 20 L28 25 L25 25 L25 27 L23 27 L23 25 L17 25 L17 27 L15 27 L15 25 L12 25 L12 20 Z" fill="#333"/>
      ${
        isSelected
          ? '<circle cx="20" cy="20" r="5" fill="white" stroke="white" stroke-width="2"/>'
          : ""
      }
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

const MapCenter = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    const validPositions = positions.filter(
      (loc) =>
        typeof loc.latitude === "number" && typeof loc.longtitude === "number"
    );

    if (validPositions.length > 0) {
      const bounds = L.latLngBounds(
        validPositions.map((loc) => [loc.latitude, loc.longtitude])
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [positions, map]);

  return null;
};

const Markers = ({ locations, devices, selectedDevice }) => {
  const markerRefs = useRef({});
  const map = useMap();

  useEffect(() => {
    if (selectedDevice && markerRefs.current[selectedDevice.id]) {
      const marker = markerRefs.current[selectedDevice.id];
      const location = locations.find(
        (loc) => loc.device_id === selectedDevice.id
      );

      if (
        location &&
        typeof location.latitude === "number" &&
        typeof location.longtitude === "number"
      ) {
        map.flyTo([location.latitude, location.longtitude], 15, {
          duration: 1,
          easeLinearity: 0.25,
        });

        setTimeout(() => {
          if (marker) marker.openPopup();
        }, 300);
      }
    }
  }, [selectedDevice, locations, map]);
  console.log("Rendering Markers for:", locations);
  console.log("Sample:", locations[0]);

  return locations
    .filter(
      (location) =>
        typeof location.latitude === "number" &&
        typeof location.longtitude === "number"
    )
    .map((location) => {
      const device = devices.find((d) => d.id === location.device_id);
      if (!device) return null;

      return (
        <Marker
          key={location.id}
          position={[location.latitude, location.longtitude]}
          icon={createCarIcon("active", selectedDevice?.id === device.id)}
          ref={(ref) => {
            if (ref) {
              markerRefs.current[device.id] = ref;
            } else {
              delete markerRefs.current[device.id];
            }
          }}
        >
          <Popup className="custom-popup">
            <DevicePopup device={device} location={location} />
          </Popup>
        </Marker>
      );
    });
};

function CarMap({ selectedDevice }) {
  const currentUser = users[3];
  const visibleDeviceIds = currentUser.is_admin
    ? devices.map((d) => d.id)
    : currentUser.devices;
  const visibleLocations = locations.filter((loc) =>
    visibleDeviceIds.includes(loc.device_id)
  );

  console.log("Visible devices:", visibleDeviceIds);
  console.log("Filtered locations:", visibleLocations);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={[31.63, -8.0]}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", minHeight: "300px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Markers
          locations={visibleLocations}
          devices={devices}
          selectedDevice={selectedDevice}
        />
        <MapCenter positions={visibleLocations} />
      </MapContainer>

      <div className="absolute bottom-2 left-2 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow-md z-[1000]">
        © OpenStreetMap contributors
      </div>

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
      `}</style>
    </div>
  );
}

export default CarMap;
