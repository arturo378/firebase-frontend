import React, { useMemo } from 'react';
import MapView, { parseGps } from '../config/MapView';
import useDashboardData from './useDashboardData';

const defaultCenter = {
  lat: 31.9686,
  lng: -99.9018,
};

const mapStyles = {
  width: '100%',
  height: 'clamp(260px, 42vh, 420px)',
  borderRadius: '12px',
};

export default function Orders({ companyId, refreshNonce }) {
  const companyQ = companyId ? `&company=${companyId}` : '';
  const { data } = useDashboardData(
    `/api/wells?limit=500${companyQ}`,
    [refreshNonce]
  );

  const marks = useMemo(() => {
    const rows = Array.isArray(data?.data) ? data.data : [];
    return rows
      .map((w) => {
        const p = parseGps(w.gps);
        return p ? { ...p, key: w.id, title: w.name } : null;
      })
      .filter(Boolean);
  }, [data]);

  return (
    <MapView
      center={defaultCenter}
      zoom={5}
      markers={marks}
      style={mapStyles}
    />
  );
}
