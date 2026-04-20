import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import MapView, { parseGps } from '../config/MapView';
import { useGetWellsQuery } from '../store/api/wellsApi';
import { selectCompanyId } from '../store/slices/dashboardFiltersSlice';

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
  const companyId = useSelector(selectCompanyId);
  const { data } = useGetWellsQuery({ limit: 500, company: companyId || undefined });

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
