import React, { useMemo } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import Title from './Title';
import useDashboardData from './useDashboardData';

function buildPath(dateRange, companyId) {
  if (!companyId) return null;
  const startDate = dateRange.startDate.toISOString();
  const endDate = dateRange.endDate.toISOString();
  return `/api/reports/weekly-earnings?startDate=${startDate}&endDate=${endDate}&company=${companyId}`;
}

export default function RevenueTrend({ dateRange, companyId, refreshNonce }) {
  const theme = useTheme();
  const path = buildPath(dateRange, companyId);
  const { data, loading, error } = useDashboardData(path, [refreshNonce]);

  const chartData = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const byDay = new Map();
    for (const r of rows) {
      if (!r.date) continue;
      const key = format(new Date(r.date), 'MM/dd');
      const total = Number(r.total) || 0;
      byDay.set(key, (byDay.get(key) || 0) + total);
    }
    return Array.from(byDay.entries())
      .map(([time, total]) => ({ time, total: Number(total.toFixed(2)) }));
  }, [data]);

  return (
    <React.Fragment>
      <Title>Revenue Trend</Title>
      {!companyId ? (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 24 }}>
          Select a company in the filter bar to view daily revenue.
        </Typography>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <CircularProgress size={28} />
        </div>
      ) : error ? (
        <Typography variant="body2" color="error">Failed to load revenue.</Typography>
      ) : chartData.length === 0 ? (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 24 }}>
          No revenue data for this range.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 16, right: 24, bottom: 0, left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(v) => `$${Number(v).toLocaleString()}`}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
              }}
              labelStyle={{ color: '#334155' }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#1e40af"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#1e40af' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  );
}
