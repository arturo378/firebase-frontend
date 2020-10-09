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

  




function WeeklyEarnings(){

const classes = useStyles();
const [age, setAge] = React.useState('');
const [data, setData] = React.useState([]);


const handleChange = (event) => {
    setAge(event.target.value);
  };



const handleSelect = (date) => {
    console.log(date);
    
  };

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }





  useEffect(() => {
    fire
      .firestore()
      .collection('assets').where('type', '==', 'company')
      .onSnapshot((snapshot) => {
        var newTimes = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        
        setData(newTimes)
      })
      
  }, [])

    
  

 



    return (
        <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs>
        <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
      />
        </Grid>
        <Grid item xs>
          

            <InputLabel id="demo-simple-select-label">Company</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
            { data.map((info) => (
                  
                  <MenuItem key={info.id} value={info.name}>{info.name}</MenuItem>
                ))}
              </Select>
          



        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}>xs</Paper>
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

export default WeeklyEarnings;