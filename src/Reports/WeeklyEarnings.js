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
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { addDays } from 'date-fns';
import * as XLSX from 'xlsx';

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

function WeeklyEarnings() {
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

  const fetchReport = async () => {
    const list = [];
    const chem_list = [];

    const ticketsSnapshot = await fire
      .firestore()
      .collection('asset_data')
      .where('type', '==', 'delivery')
      .where('date', '>', state[0].startDate)
      .where('date', '<', state[0].endDate)
      .where('company', '==', company)
      .get();

    const tickets = ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    tickets.forEach(ticket => chem_list.push(ticket.id));

    if (chem_list.length > 0) {
      const deliveryChemsSnapshot = await fire
        .firestore()
        .collection('asset_data')
        .where('type', '==', 'delivery_chemical')
        .where('deliveryid', 'in', chem_list)
        .get();

      const delivery_chems = deliveryChemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      tickets.forEach(ticket => {
        delivery_chems.forEach(dc => {
          if (ticket.id === dc.deliveryid) {
            pricing.forEach(price => {
              if (ticket.companyid === price.company && dc.name === price.name) {
                list.push({
                  Date: moment(ticket.date.Timestamp).format("MM/DD/YY"),
                  Data_Number: ticket.datanumber,
                  GPS: ticket.gps,
                  Company: ticket.company,
                  Lease: ticket.lease,
                  Well: ticket.well,
                  Chemical: dc.name,
                  Quantity: dc.quantity,
                  Pricing: price.price,
                  Total: price.price * dc.quantity
                });
              }
            });
          }
        });
      });

      setData(list);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Data Number', 'Date', 'Company', 'Lease', 'Well', 'GPS Coordinate', 'Chemical', 'Price', 'Quantity', 'Total'],
      ...data.map((row) => [
        row.Data_Number,
        row.Date,
        row.Company,
        row.Lease,
        row.Well,
        row.GPS,
        row.Chemical,
        row.Pricing,
        row.Quantity,
        row.Total,
      ]),
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Weekly_Report.xlsx');
  };

  useEffect(() => {
    const unsubscribeCompanies = fire
      .firestore()
      .collection('assets')
      .where('type', '==', 'company')
      .onSnapshot(snapshot => {
        const companydata = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCompanies(companydata);
      });

    const unsubscribePricing = fire
      .firestore()
      .collection('assets')
      .where('type', '==', 'pricing')
      .onSnapshot(snapshot => {
        const prices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPricing(prices);
      });

    return () => {
      unsubscribeCompanies();
      unsubscribePricing();
    };
  }, []);

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
            {companies.map(info => (
              <MenuItem key={info.id} value={info.name}>{info.name}</MenuItem>
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

export default WeeklyEarnings;