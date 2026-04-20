import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import { useGetWarehousesQuery } from '../store/api/warehousesApi';
import { useGetWarehouseInventoryReportQuery } from '../store/api/reportsApi';

export default function WarehouseInventory() {
  const theme = useTheme();
  const [warehouseId, setWarehouseId] = useState('');

  const { data: warehousesData } = useGetWarehousesQuery({ limit: 100 });
  const warehouses = useMemo(
    () => warehousesData?.data ?? [],
    [warehousesData]
  );

  useEffect(() => {
    if (!warehouseId && warehouses.length > 0) {
      setWarehouseId(warehouses[0].id);
    }
  }, [warehouses, warehouseId]);

  const { data, isFetching, error } = useGetWarehouseInventoryReportQuery(
    warehouseId ? { warehouse: warehouseId } : undefined,
    { skip: !warehouseId }
  );

  const chartData = useMemo(() => {
    const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return rows
      .map((r) => ({ name: r.chemical, quantity: Number(r.quantity) || 0 }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 12);
  }, [data]);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Title>Warehouse Inventory</Title>
        <FormControl size="small" variant="outlined" style={{ minWidth: 180 }}>
          <InputLabel id="warehouse-select">Warehouse</InputLabel>
          <Select
            labelId="warehouse-select"
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            label="Warehouse"
          >
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name || w.warehousenumber || 'Warehouse'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {!warehouseId ? (
        <Typography variant="body2" color="textSecondary">No warehouses available.</Typography>
      ) : isFetching ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <CircularProgress size={28} />
        </div>
      ) : error ? (
        <Typography variant="body2" color="error">Failed to load inventory.</Typography>
      ) : chartData.length === 0 ? (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
          No chemicals in this warehouse.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(240, chartData.length * 28)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 24, bottom: 8, left: 16 }}
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
            />
            <Bar dataKey="quantity" fill="#16a34a" radius={[0, 6, 6, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  );
}
