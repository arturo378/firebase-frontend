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
import { addDays } from 'date-fns';

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

  




function WeeklyEarnings(){
const classes = useStyles();
const [data, setData] = useState([]);
const [companies, setCompanies] = useState([]);
const [pricing, setPricing] = useState([]);
const [company, setCompany] = useState('');
const [state, setState] = useState([
  {
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  }
]);
const handleChange = (event) => {
    setCompany(event.target.value);
  };

  const fetchReport = async (data) => {
    var list = [];
    var chem_list = [];
    

  
    await fire
    .firestore()
    .collection('asset_data').where('type', '==', 'delivery')
    .where('date', '>', state[0].startDate)
    .where('date', '<', state[0].endDate)
    .where('company', '==', company)
    .onSnapshot((snapshot) => {
      var tickets = snapshot.docs.map(((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
      
      for (var key in tickets) {
        chem_list.push(tickets[key].id)
      }

     if(chem_list.length>0){

      fire
      .firestore()
      .collection('asset_data').where('type', '==', 'delivery_chemical')
      .where('deliveryid', 'in', chem_list)
      .onSnapshot((snapshot) => {
        var delivery_chems = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        
       
        for (var key in tickets) {
          for (var key2 in delivery_chems) {
            if(tickets[key].id == delivery_chems[key2].deliveryid){
              for(var key3 in pricing){
                if(tickets[key].companyid == pricing[key3].company && delivery_chems[key2].name == pricing[key3].name){

                  list.push({
                    'Date': moment(tickets[key].date.Timestamp).format("MM/DD/YY"),
                    'Data_Number': tickets[key].datanumber,
                    'GPS': tickets[key].gps,
                    'Company': tickets[key].company,
                    'Lease': tickets[key].lease,
                    'Well': tickets[key].well,
                    'Chemical': delivery_chems[key2].name,
                    'Quantity': delivery_chems[key2].quantity,
                    'Pricing': pricing[key3].price,
                    'Total':  pricing[key3].price*delivery_chems[key2].quantity
                  })


                }

                
              }

              
              
            }



          }

          // newTimes[key].date = moment(newTimes[key].date.toDate()).format("MM/DD/YY");
        }
        console.log(list)
        setData(list);
        
  
        // newTimes.date = moment(newTimes.date).format("MM/DD/YY"); 
        // console.log(moment(newTimes[0].date.toDate()).format("MM/DD/YY"));return;
        // setData(newTimes)
      })
     }
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
      .collection('assets').where('type', '==', 'company')
      .onSnapshot((snapshot) => {
        var companydata = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        
        setCompanies(companydata)
      })


      fire
    .firestore()
    .collection('assets').where('type', '==', 'pricing')
    .onSnapshot((snapshot) => {
      var prices = snapshot.docs.map(((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
      
      setPricing(prices)
    })
      
  }, [])

    
  

 



    return (
        <div className={classes.root}>
          <Typography variant="h3" component="h2" gutterBottom>
        Earnings Report
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs> 
        <DateRangePicker
        onChange={item => setState([item.selection])}
        ranges={state}
      />
        </Grid>
        <Grid item xs>
          

            <InputLabel id="demo-simple-select-label">Company</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={company}
          onChange={handleChange}
        >
            { companies.map((info) => (
                  
                  <MenuItem key={info.id} value={info.name}>{info.name}</MenuItem>
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
                  <ExcelColumn label="Data Number" value="Data_Number"/>
                  <ExcelColumn label="Date" value="Date"/>
                  <ExcelColumn label="Company" value="Company"/>
                  <ExcelColumn label="Lease" value="Lease"/>
                  <ExcelColumn label="Well" value="Well"/>
                  <ExcelColumn label="GPS Coordinate" value="GPS"/>
                  <ExcelColumn label="Chemical" value="Chemical"/>
                  <ExcelColumn label="Price" value="Pricing"/>
                  <ExcelColumn label="Quantity" value="Quantity"/>
                  <ExcelColumn label="Total" value="Total"/>
                  
                  
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

export default WeeklyEarnings;