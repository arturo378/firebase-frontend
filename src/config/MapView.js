import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function parseGps(str) {
  if (!str || typeof str !== 'string') return null;
  const parts = str.split(',');
  if (parts.length < 2) return null;
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

export default function MapView({ center, zoom = 13, markers = [], style }) {
  if (!center || typeof center.lat !== 'number' || typeof center.lng !== 'number') {
    return null;
  }
  const position = [center.lat, center.lng];
  return (
    <Map center={position} zoom={zoom} style={style}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => {
        if (!m || typeof m.lat !== 'number' || typeof m.lng !== 'number') return null;
        return (
          <Marker key={m.key != null ? m.key : i} position={[m.lat, m.lng]}>
            {m.title ? <Popup>{m.title}</Popup> : null}
          </Marker>
        );
      })}
    </Map>
  );
}
