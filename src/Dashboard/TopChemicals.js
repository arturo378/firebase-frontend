import React, { useMemo } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import useDashboardData from './useDashboardData';

function buildPath(dateRange, companyId) {
  if (!companyId) return null;
  const startDate = dateRange.startDate.toISOString();
  const endDate = dateRange.endDate.toISOString();
  return `/api/reports/weekly-earnings?startDate=${startDate}&endDate=${endDate}&company=${companyId}`;
}

export default function TopChemicals({ dateRange, companyId, refreshNonce }) {
  const theme = useTheme();
  const path = buildPath(dateRange, companyId);
  const { data, loading, error } = useDashboardData(path, [refreshNonce]);

  const chartData = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const totals = new Map();
    for (const r of rows) {
      const chem = r.chemical || 'Unknown';
      const qty = Number(r.quantity) || 0;
      totals.set(chem, (totals.get(chem) || 0) + qty);
    }
    return Array.from(totals.entries())
      .map(([name, quantity]) => ({ name, quantity: Number(quantity.toFixed(2)) }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [data]);

  return (
    <React.Fragment>
      <Title>Top Chemicals by Volume</Title>
      {!companyId ? (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 24 }}>
          Select a company to see top chemicals.
        </Typography>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <CircularProgress size={28} />
        </div>
      ) : error ? (
        <Typography variant="body2" color="error">Failed to load.</Typography>
      ) : chartData.length === 0 ? (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 24 }}>
          No chemical usage for this range.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(240, chartData.length * 32)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" stroke={theme.palette.text.secondary} />
            <YAxis
              type="category"
              dataKey="name"
              stroke={theme.palette.text.secondary}
              width={140}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
              }}
              labelStyle={{ color: '#334155' }}
            />
            <Bar dataKey="quantity" fill="#0891b2" radius={[0, 6, 6, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  );
}
