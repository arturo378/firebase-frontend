import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import fire from '../config/fire';
import Button from '@material-ui/core/Button';
import ReactExport from "react-export-excel";

import Typography from '@material-ui/core/Typography';



const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;






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

  




function WarehouseInventory(){
const classes = useStyles();
const [data, setData] = useState([]);
const [warehouses, setWarehouses] = useState([]);
const [warehouse, setWarehouse] = useState([]);


const handleChange = (event) => {
    setWarehouse(event.target.value);
    console.log(event.target.value)
  };

  const fetchReport = (data) => {

    fire
      .firestore()
      .collection('asset_data').where('type', '==', 'warehouse_chemical')
      .where('warehouseid', '==', warehouse.id)
      .onSnapshot((snapshot) => {
        var warehousedata = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
       

        for (var key in warehousedata) {
            warehousedata[key].company = warehouse.name
            warehousedata[key].areamanager = warehouse.areamanager
        }
        console.log(warehousedata)

        setData(warehousedata)
        // setWarehouses(warehousedata)
      })

      
 
    

   

    
    
  };


  useEffect(() => {
    fire
      .firestore()
      .collection('assets').where('type', '==', 'warehouse')
      .onSnapshot((snapshot) => {
        var warehousedata = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        
        setWarehouses(warehousedata)
      })

      
  }, [])

    
  

 



    return (
        <div className={classes.root}>
            <Typography variant="h3" component="h2" gutterBottom>
        Warehouse Inventory Report
      </Typography>
      <Grid container spacing={3}>
        
        <Grid item xs>
          

            <InputLabel id="demo-simple-select-label">Warehouse</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={warehouse}
          onChange={handleChange}
        >
            { warehouses.map((info) => (
                  
                  <MenuItem key={info.id} value={info}>{info.name}</MenuItem>
                ))}
              </Select>
          



        </Grid>
        <Grid item xs>
        <Button variant="outlined" color="primary" onClick={fetchReport}>Run Report</Button>

        {(function() {
          if (data.length>0) {
            return (
              <ExcelFile element={<button>Download Excel</button>}>
              <ExcelSheet data={data} name="Employees">
                  <ExcelColumn label="Company" value="company"/>
                  <ExcelColumn label="Chemical" value="name"/>
                  <ExcelColumn label="Quantity" value="quantity"/>
                  <ExcelColumn label="Area Manager" value="areamanager"/>
                  
                  
                  
              </ExcelSheet>
          </ExcelFile>
            )}
        })()}


        
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs>
          <Paper className={classes.paper}>xs</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}>xs</Paper>
        </Grid>
      </Grid>
    </div>


    );
}

export default WarehouseInventory;