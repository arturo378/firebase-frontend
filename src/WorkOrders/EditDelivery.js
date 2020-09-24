import React, { useState, useEffect } from 'react';
import MaterialTable, {MTableToolbar}  from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import { Select, MenuItem } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import fire from '../config/fire';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: '3em',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


function DeliveryEdit(props){
  const [company, setCompany] = React.useState('');
  const [open, setOpen] = React.useState(false);


  const handleChange = (event) => {
    setCompany(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


 
  
  function getChemicals(){
    var info = [];
    fire
    .firestore()
    .collection('assets').where('type', '==', 'chemical')
    .onSnapshot((snapshot) => {
      const chemicals = snapshot.docs.map(((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
      
       info.push(chemicals)
    })
  return info;
}

  useEffect(() => {
    // console.log(location.state)
    // const id = location.state.id
 


    // fire
    //   .firestore()
    //   .collection('asset_data').where('type', '==', 'shipping_chemical').where('shippingid', '==', id)
    //   .onSnapshot((snapshot) => {
    //     const newTimes = snapshot.docs.map(((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
          
    //     })))
    //     setData(newTimes)
    //   })
  }, [])
    //setData(newTimes)
    
    



  const history = useHistory(); 
    function back() {
      
      
      history.push({
        pathname: '/shippingpapers'
       
      });
    }

  
    const classes = useStyles();

    
    
    return (
      <div className={classes.root}>

        <Grid container spacing={3}>
        <Grid item xs>
        <InputLabel className={classes.paper} id="demo-controlled-open-select-label">Company</InputLabel>
        <Select
        
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={company}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}>xs</Paper>
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

export default DeliveryEdit;