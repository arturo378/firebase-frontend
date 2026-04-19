import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import OilBarrelIcon from '@material-ui/icons/LocalShipping';
import LocationIcon from '@material-ui/icons/Place';
import DescriptionIcon from '@material-ui/icons/Description';
import HourglassIcon from '@material-ui/icons/HourglassEmpty';
import KpiCard from './KpiCard';
import useDashboardData from './useDashboardData';

function withinRange(iso, start, end) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export default function KpiRow({ dateRange, companyId, refreshNonce }) {
  const companyQ = companyId ? `&company=${companyId}` : '';

  const wells = useDashboardData(
    `/api/wells?limit=1${companyQ}`,
    [refreshNonce]
  );
  const deliveries = useDashboardData(
    `/api/deliveries?limit=500${companyQ}`,
    [refreshNonce]
  );
  const shippingPapers = useDashboardData(
    `/api/shipping-papers?limit=500`,
    [refreshNonce]
  );
  const pending = useDashboardData(
    `/api/deliveries?active=0&limit=1${companyQ}`,
    [refreshNonce]
  );

  const deliveriesInRange = useMemo(() => {
    if (!deliveries.data?.data) return null;
    return deliveries.data.data.filter((d) =>
      withinRange(d.date, dateRange.startDate, dateRange.endDate)
    ).length;
  }, [deliveries.data, dateRange]);

  const shippingInRange = useMemo(() => {
    if (!shippingPapers.data?.data) return null;
    return shippingPapers.data.data.filter((s) =>
      withinRange(s.date, dateRange.startDate, dateRange.endDate)
    ).length;
  }, [shippingPapers.data, dateRange]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard
          label="Active Wells"
          value={wells.data?.totalItems}
          hint={companyId ? 'Filtered by company' : 'All companies'}
          icon={<LocationIcon fontSize="small" />}
          accent="#dbeafe"
          accentText="#1e40af"
          to="/locationmanagment"
          loading={wells.loading}
          error={wells.error}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard
          label="Deliveries (range)"
          value={deliveriesInRange}
          hint="Within selected date range"
          icon={<OilBarrelIcon fontSize="small" />}
          accent="#dcfce7"
          accentText="#166534"
          to="/delivery"
          loading={deliveries.loading}
          error={deliveries.error}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard
          label="Shipping Papers (range)"
          value={shippingInRange}
          hint="Within selected date range"
          icon={<DescriptionIcon fontSize="small" />}
          accent="#ede9fe"
          accentText="#6d28d9"
          to="/shippingpapers"
          loading={shippingPapers.loading}
          error={shippingPapers.error}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard
          label="Pending Deliveries"
          value={pending.data?.totalItems}
          hint="Not yet completed"
          icon={<HourglassIcon fontSize="small" />}
          accent="#fee2e2"
          accentText="#b91c1c"
          to="/delivery"
          loading={pending.loading}
          error={pending.error}
        />
      </Grid>
    </Grid>
  );
}
