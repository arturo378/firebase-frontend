import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import OilBarrelIcon from '@material-ui/icons/LocalShipping';
import LocationIcon from '@material-ui/icons/Place';
import DescriptionIcon from '@material-ui/icons/Description';
import HourglassIcon from '@material-ui/icons/HourglassEmpty';
import KpiCard from './KpiCard';
import { useGetWellsQuery } from '../store/api/wellsApi';
import { useGetDeliveriesQuery } from '../store/api/deliveriesApi';
import { useGetShippingPapersQuery } from '../store/api/shippingPapersApi';
import { selectDateRange, selectCompanyId } from '../store/slices/dashboardFiltersSlice';

function withinRange(iso, start, end) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export default function KpiRow() {
  const dateRange = useSelector(selectDateRange);
  const companyId = useSelector(selectCompanyId);

  const wells = useGetWellsQuery({ limit: 1, company: companyId || undefined });
  const deliveries = useGetDeliveriesQuery({ limit: 500, company: companyId || undefined });
  const shippingPapers = useGetShippingPapersQuery({ limit: 500 });
  const pending = useGetDeliveriesQuery({ limit: 1, active: 0, company: companyId || undefined });

  const deliveriesInRange = useMemo(() => {
    const rows = deliveries.data?.data;
    if (!rows) return null;
    return rows.filter((d) =>
      withinRange(d.date, dateRange.startDate, dateRange.endDate)
    ).length;
  }, [deliveries.data, dateRange]);

  const shippingInRange = useMemo(() => {
    const rows = shippingPapers.data?.data;
    if (!rows) return null;
    return rows.filter((s) =>
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
          loading={wells.isFetching}
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
          loading={deliveries.isFetching}
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
          loading={shippingPapers.isFetching}
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
          loading={pending.isFetching}
          error={pending.error}
        />
      </Grid>
    </Grid>
  );
}
