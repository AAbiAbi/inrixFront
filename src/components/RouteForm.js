import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RouteForm = () => {
  const [startLat, setStartLat] = useState('');
  const [startLng, setStartLng] = useState('');
  const [endLat, setEndLat] = useState('');
  const [endLng, setEndLng] = useState('');
  const [route, setRoute] = useState(null);
  const [position, setPosition] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch(`http://127.0.0.1:5000/quickpath?start_lat=${startLat}&start_lng=${startLng}&end_lat=${endLat}&end_lng=${endLng}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setRoute(data);

    // Check if the waypoints data exists and is in the expected format
    if (data.result && data.result.trip && data.result.trip.routes && data.result.trip.routes[0] && data.result.trip.routes[0].wayPoints) {
      // Extract coordinates from the response and set them to state
      const coordinates = data.result.trip.routes[0].wayPoints.map(wp => {
        return [wp.geometry.coordinates[0][1], wp.geometry.coordinates[0][0]];
      });
      setRouteCoords(coordinates);
    } else {
      // Handle the case where the data is not in the expected format
      console.error('Unexpected response structure:', data);
    }
  } catch (error) {
    console.error('Failed to fetch route:', error);
  }
  };

  // Function to set the start and end positions
  const handleMapClick = (latlng) => {
    if (!startLat || !startLng) {
      setStartLat(latlng.lat);
      setStartLng(latlng.lng);
    } else {
      setEndLat(latlng.lat);
      setEndLng(latlng.lng);
    }
  };

  function LocationMarker({ setPosition }) {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return null;
  }
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={startLat}
          onChange={(e) => setStartLat(e.target.value)}
          placeholder="Start Latitude"
          required
        />
        <input
          type="text"
          value={startLng}
          onChange={(e) => setStartLng(e.target.value)}
          placeholder="Start Longitude"
          required
        />
        <input
          type="text"
          value={endLat}
          onChange={(e) => setEndLat(e.target.value)}
          placeholder="End Latitude"
          required
        />
        <input
          type="text"
          value={endLng}
          onChange={(e) => setEndLng(e.target.value)}
          placeholder="End Longitude"
          required
        />
        <button type="submit">Get Route</button>
      </form>
      {route && (
        <div>
          <h3>Route Information:</h3>
          <pre>{JSON.stringify(route, null, 2)}</pre>
        </div>
      )}

        <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        <LocationMarker setPosition={handleMapClick} />
        {position && <Marker position={position}></Marker>}
        {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default RouteForm;

