import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import { BarChart, Tooltip, Bar, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid } from 'recharts';
import Title from './Title';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { addDays, format, differenceInCalendarDays, startOfDay } from 'date-fns';
import { useGetDeliveriesQuery } from '../store/api/deliveriesApi';
import { selectDateRange, selectCompanyId } from '../store/slices/dashboardFiltersSlice';

function bucketDeliveries(rows, startDate, endDate) {
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  const dayCount = Math.max(1, differenceInCalendarDays(end, start) + 1);
  const buckets = [];
  for (let i = 0; i < dayCount; i++) {
    const day = addDays(start, i);
    buckets.push({ time: format(day, 'MM/dd'), day, amount: 0 });
  }
  for (const d of rows) {
    if (!d.date) continue;
    const t = new Date(d.date).getTime();
    const idx = differenceInCalendarDays(startOfDay(new Date(t)), start);
    if (idx >= 0 && idx < dayCount) buckets[idx].amount += 1;
  }
  return buckets;
}

export default function Chart() {
  const theme = useTheme();
  const dateRange = useSelector(selectDateRange);
  const companyId = useSelector(selectCompanyId);

  const { data, isFetching, error } = useGetDeliveriesQuery({
    limit: 500,
    company: companyId || undefined,
  });

  const chartData = useMemo(() => {
    const rows = Array.isArray(data?.data) ? data.data : [];
    if (!dateRange) return [];
    return bucketDeliveries(rows, dateRange.startDate, dateRange.endDate);
  }, [data, dateRange]);

  const dayCount = dateRange
    ? Math.max(1, differenceInCalendarDays(dateRange.endDate, dateRange.startDate) + 1)
    : 0;

  return (
    <React.Fragment>
      <Title>{`Delivery Count — last ${dayCount} day${dayCount === 1 ? '' : 's'}`}</Title>
      {isFetching ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <CircularProgress size={28} />
        </div>
      ) : error ? (
        <Typography variant="body2" color="error">Failed to load deliveries.</Typography>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 16, bottom: 0, left: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} allowDecimals={false}>
              <Label
                angle={270}
                position="left"
                style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
              >
                Deliveries (Count)
              </Label>
            </YAxis>
            <Tooltip
              wrapperStyle={{ borderRadius: 8 }}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
              }}
              labelStyle={{ color: '#334155' }}
            />
            <Bar dataKey="amount" fill="#1e40af" barSize={28} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  );
}
