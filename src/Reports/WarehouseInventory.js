import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as XLSX from 'xlsx';
import api from '../config/api';

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function WarehouseInventory() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouse, setWarehouse] = useState('');

  const handleChange = (event) => setWarehouse(event.target.value);

  const fetchReport = async () => {
    if (!warehouse) return;
    try {
      const result = await api.get(`/api/reports/warehouse-inventory?warehouse=${warehouse}`);
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Warehouse', 'Chemical', 'Quantity', 'Area Manager'],
      ...data.map((row) => [
        row.warehouse,
        row.chemical,
        row.quantity,
        row.areamanager,
      ]),
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Warehouse_Inventory_Report.xlsx');
  };

  useEffect(() => {
    api.get('/api/warehouses?limit=100').then(res => setWarehouses(res.data)).catch(console.error);
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h3" component="h2" gutterBottom>
        Warehouse Inventory Report
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs>
          <InputLabel id="warehouse-select-label">Warehouse</InputLabel>
          <Select
            labelId="warehouse-select-label"
            id="warehouse-select"
            value={warehouse}
            onChange={handleChange}
          >
            {warehouses.map(info => (
              <MenuItem key={info.id} value={info.id}>{info.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs>
          <Button variant="outlined" color="primary" onClick={fetchReport}>Run Report</Button>
        </Grid>
        {data.length > 0 && (
          <Grid item xs={12}>
            <Button variant="outlined" color="primary" onClick={exportToExcel}>
              Download Excel
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default WarehouseInventory;
