import React, { useState, useEffect } from 'react';
import MapView, { parseGps } from '../config/MapView';
import api from '../config/api';

const defaultCenter = {
  lat: 31.9686,
  lng: -99.9018,
};

const mapStyles = {
  width: '100%',
  height: 'clamp(260px, 42vh, 420px)',
  borderRadius: '12px',
};

export default function Orders() {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    api.get('/api/wells?limit=500')
      .then((result) => {
        const rows = Array.isArray(result?.data) ? result.data : [];
        const points = rows
          .map((w) => {
            const p = parseGps(w.gps);
            return p ? { ...p, key: w.id, title: w.name } : null;
          })
          .filter(Boolean);
        setMarks(points);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <MapView
      center={defaultCenter}
      zoom={5}
      markers={marks}
      style={mapStyles}
    />
  );
}
