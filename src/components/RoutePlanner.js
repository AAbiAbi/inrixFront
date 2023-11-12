import React, { useState } from 'react';
import axios from 'axios';

const RoutePlanner = () => {
  const [start, setStart] = useState({ lat: '', lng: '' });
  const [end, setEnd] = useState({ lat: '', lng: '' });
  const [route, setRoute] = useState(null);

  const fetchRoute = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/quickpath?start_lat=${start.lat}&start_lng=${start.lng}&end_lat=${end.lat}&end_lng=${end.lng}`
      );
      setRoute(response.data);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRoute();
  };

  return (
    <div>
      <h1>Route Planner</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Start Latitude"
          value={start.lat}
          onChange={(e) => setStart({ ...start, lat: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Start Longitude"
          value={start.lng}
          onChange={(e) => setStart({ ...start, lng: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="End Latitude"
          value={end.lat}
          onChange={(e) => setEnd({ ...end, lat: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="End Longitude"
          value={end.lng}
          onChange={(e) => setEnd({ ...end, lng: e.target.value })}
          required
        />
        <button type="submit">Get Route</button>
      </form>

      {route && (
        <div>
          <h2>Route Details</h2>
          {/* Display route details */}
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;
