import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import useDashboardData from './useDashboardData';

const COLORS = ['#1e40af', '#0891b2', '#16a34a', '#ea580c', '#7c3aed', '#db2777', '#0f766e', '#ca8a04', '#2563eb', '#14b8a6'];
const OTHERS_COLOR = '#94a3b8';
const OTHERS_ID = '__others__';
const TOP_N = 10;

function withinRange(iso, start, end) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export default function DeliveriesByCompany({
  dateRange,
  companyId,
  focusedCompanyId,
  onSliceClick,
  refreshNonce,
}) {
  const { data, loading, error } = useDashboardData(
    '/api/deliveries?limit=500',
    [refreshNonce]
  );

  const { chartData, totalCompanies, totalDeliveries, othersBreakdown } = useMemo(() => {
    const rows = Array.isArray(data?.data) ? data.data : [];
    const counts = new Map();
    for (const d of rows) {
      if (!withinRange(d.date, dateRange.startDate, dateRange.endDate)) continue;
      const name = d.company?.name || 'Unknown';
      const id = d.company?.id || 'unknown';
      const key = `${id}|${name}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const all = Array.from(counts.entries())
      .map(([key, value]) => {
        const [id, name] = key.split('|');
        return { id, name, value };
      })
      .sort((a, b) => b.value - a.value);

    const total = all.reduce((s, x) => s + x.value, 0);

    if (all.length <= TOP_N + 1) {
      return { chartData: all, totalCompanies: all.length, totalDeliveries: total, othersBreakdown: [] };
    }

    const top = all.slice(0, TOP_N);
    const rest = all.slice(TOP_N);
    const othersValue = rest.reduce((s, x) => s + x.value, 0);
    top.push({ id: OTHERS_ID, name: `Others (${rest.length})`, value: othersValue });
    return { chartData: top, totalCompanies: all.length, totalDeliveries: total, othersBreakdown: rest };
  }, [data, dateRange]);

  if (companyId) {
    return (
      <React.Fragment>
        <Title>Deliveries by Company</Title>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 24 }}>
          Clear the company filter to compare across companies.
        </Typography>
      </React.Fragment>
    );
  }

  const handleSliceClick = (slice) => {
    if (!onSliceClick) return;
    if (!slice || slice.id === OTHERS_ID) return;
    onSliceClick(slice.id, slice.name);
  };

  const renderTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const p = payload[0].payload;
    const pct = totalDeliveries ? ((p.value / totalDeliveries) * 100).toFixed(1) : 0;
    return (
      <div style={{
        borderRadius: 8,
        border: '1px solid #cbd5e1',
        backgroundColor: '#ffffff',
        padding: '6px 10px',
        fontSize: 12,
      }}>
        <div style={{ fontWeight: 600 }}>{p.name}</div>
        <div>{p.value} deliveries ({pct}%)</div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Title>Deliveries by Company</Title>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <CircularProgress size={28} />
        </div>
      ) : error ? (
        <Typography variant="body2" color="error">Failed to load.</Typography>
      ) : chartData.length === 0 ? (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 24 }}>
          No deliveries in this range.
        </Typography>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 12, minHeight: 320 }}>
          <div style={{ flex: '1 1 55%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={1}
                  onClick={handleSliceClick}
                  style={{ cursor: onSliceClick ? 'pointer' : 'default' }}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={entry.id}
                      fill={entry.id === OTHERS_ID ? OTHERS_COLOR : COLORS[idx % COLORS.length]}
                      stroke={focusedCompanyId === entry.id ? '#0f172a' : '#ffffff'}
                      strokeWidth={focusedCompanyId === entry.id ? 3 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="caption" color="textSecondary" style={{ display: 'block', textAlign: 'center', marginTop: -8 }}>
              {totalCompanies} companies · {totalDeliveries} deliveries
            </Typography>
          </div>
          <div style={{
            flex: '1 1 45%',
            minWidth: 0,
            maxHeight: 300,
            overflowY: 'auto',
            paddingRight: 4,
          }}>
            {chartData.map((entry, idx) => {
              const pct = totalDeliveries ? ((entry.value / totalDeliveries) * 100).toFixed(1) : 0;
              const isOthers = entry.id === OTHERS_ID;
              const isFocused = focusedCompanyId === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => handleSliceClick(entry)}
                  title={isOthers ? othersBreakdown.map((c) => `${c.name}: ${c.value}`).join('\n') : entry.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 6px',
                    borderRadius: 4,
                    cursor: (!isOthers && onSliceClick) ? 'pointer' : 'default',
                    backgroundColor: isFocused ? '#f1f5f9' : 'transparent',
                    fontSize: 12,
                  }}
                >
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: isOthers ? OTHERS_COLOR : COLORS[idx % COLORS.length],
                    marginRight: 8,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: isFocused ? 600 : 400,
                  }}>
                    {entry.name}
                  </span>
                  <span style={{ color: '#64748b', marginLeft: 8, flexShrink: 0 }}>
                    {entry.value} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
