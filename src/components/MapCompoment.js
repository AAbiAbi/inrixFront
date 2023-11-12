import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ routeCoords, handleMapClick }) => {
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (route && route.result && route.result.trip && route.result.trip.routes) {
      const routePath = route.result.trip.routes[0].wayPoints.map(wp => {
        const [lng, lat] = wp.geometry.coordinates[0];
        return [lat, lng]; // Ensure the order is [latitude, longitude]
      });
      setPath(routePath);
    }
  }, [route]);

  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {path.length > 0 && <Polyline positions={path} color="blue" />}
    </MapContainer>
  );
};

export default MapComponent;
