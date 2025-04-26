import React from "react";
import vehicles from "../assets/data/carsDummy";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
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

function CarMap() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[31.63, -8.0]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map((vehicle) => (
          <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]}>
            <Popup>
              <strong>{vehicle.name}</strong> <br />
              Status: {vehicle.status} <br />
              Speed: {vehicle.speed} km/h
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CarMap;
