import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
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
import moment  from 'moment';
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

  




function UserReport(){
const classes = useStyles();
const [data, setData] = useState([]);
const [users, setUsers] = useState([]);
const [pricing, setPricing] = useState([]);
const [user, setUser] = useState('');
const [date, setDate] = useState([]);
const handleChange = (event) => {
    setUser(event.target.value);
  };
const handleSelect = (info) => {
    setDate(info)
  };
  const fetchReport = (data) => {
    var list = [];
    
    

    
     fire
    .firestore()
    .collection('asset_data').where('type', '==', 'delivery')
    .where('date', '>', date.selection.startDate)
    .where('date', '<', date.selection.endDate)
    .where('createdBy', '==', user)
    .onSnapshot((snapshot) => {
      var deliveries = snapshot.docs.map(((doc) => ({
        id: doc.id,
        ...doc.data()
      })))

      for (var key in deliveries) {

        
        list.push(deliveries[key]);
      
      }
    //   list.push(deliveries)
      
    

      fire
      .firestore()
      .collection('asset_data').where('type', '==', 'shipping_papers')
      .where('date', '>', date.selection.startDate)
        .where('date', '<', date.selection.endDate)
      .where('createdby', '==', user)
      .onSnapshot((snapshot) => {
        var shipping = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))

        for (var key2 in shipping) {

           list.push(shipping[key2])
          }
        
        if(list.length>0){
            for (var key in list) {

                if(list[key].date){
                list[key].date = moment(list[key].date.toDate()).format("MM/DD/YY");
              }
              }
        }
        console.log(list)
        setData(list)
 
        // newTimes.date = moment(newTimes.date).format("MM/DD/YY"); 
        // console.log(moment(newTimes[0].date.toDate()).format("MM/DD/YY"));return;
        // setData(newTimes)
      })
     
    })
    
 



     

    
    
  };

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }





  useEffect(() => {
    fire
      .firestore()
      .collection('users')
      .onSnapshot((snapshot) => {
        var userdata = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        
        setUsers(userdata)
      })


      
  }, [])

    
  

 



    return (
        <div className={classes.root}>
            <Typography variant="h3" component="h2" gutterBottom>
        User Report
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs>
        <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
      />
        </Grid>
        <Grid item xs>
          

            <InputLabel id="demo-simple-select-label">User</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={user}
          onChange={handleChange}
        >
            { users.map((info) => (
                  
                  <MenuItem key={info.id} value={info.fullname}>{info.fullname}</MenuItem>
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
                  <ExcelColumn label="Data Number" value="datanumber"/>
                  <ExcelColumn label="Date" value="date"/>
                  <ExcelColumn label="Company" value="company"/>
                  <ExcelColumn label="Lease" value="lease"/>
                  <ExcelColumn label="Well" value="well"/>
                  <ExcelColumn label="GPS Coordinate" value="gps"/>
                  <ExcelColumn label="Comments" value="comments"/>
                  <ExcelColumn label="Origin Warehouse" value="originwarehousenumber"/>
                  <ExcelColumn label="Destination Warehouse" value="destinationwarehousenumber"/>
                  <ExcelColumn label="Truck Number" value="trucknumber"/>
                  
                  
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

export default UserReport;