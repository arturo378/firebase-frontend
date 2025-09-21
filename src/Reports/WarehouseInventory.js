import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import fire from '../config/fire';
import Button from '@material-ui/core/Button';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
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
  const [warehouse, setWarehouse] = useState(null);

  const handleChange = (event) => {
    setWarehouse(event.target.value);
  };

  const fetchReport = async () => {
    if (!warehouse) return;

    const snapshot = await fire
      .firestore()
      .collection('asset_data')
      .where('type', '==', 'warehouse_chemical')
      .where('warehouseid', '==', warehouse.id)
      .get();

    const warehousedata = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      company: warehouse.name,
      areamanager: warehouse.areamanager
    }));

    setData(warehousedata);
  };

  useEffect(() => {
    const unsubscribe = fire
      .firestore()
      .collection('assets')
      .where('type', '==', 'warehouse')
      .onSnapshot(snapshot => {
        const warehousedata = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWarehouses(warehousedata);
      });

    return () => unsubscribe();
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
            value={warehouse || ''}
            onChange={handleChange}
          >
            {warehouses.map(info => (
              <MenuItem key={info.id} value={info}>{info.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs>
          <Button variant="outlined" color="primary" onClick={fetchReport}>Run Report</Button>
        </Grid>
        {data.length > 0 && (
          <Grid item xs={12}>
            <ReactHTMLTableToExcel
              id="warehouse-report-btn"
              className="btn btn-primary"
              table="warehouse-report-table"
              filename="Warehouse_Inventory_Report"
              sheet="Sheet1"
              buttonText="Download Excel"
            />
            <table id="warehouse-report-table" style={{ display: 'none' }}>
              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Chemical</th>
                  <th>Quantity</th>
                  <th>Area Manager</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.company}</td>
                    <td>{row.name}</td>
                    <td>{row.quantity}</td>
                    <td>{row.areamanager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default WarehouseInventory;