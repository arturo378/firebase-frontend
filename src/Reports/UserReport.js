import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import fire from '../config/fire';
import Button from '@material-ui/core/Button';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { addDays } from 'date-fns';

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

function UserReport() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState('');
  const [state, setState] = useState([{
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  }]);

  const handleChange = (event) => {
    setUser(event.target.value);
  };

  const fetchReport = async () => {
    if (!user) return;

    let list = [];

    // Fetch deliveries
    const deliveriesSnap = await fire
      .firestore()
      .collection('asset_data')
      .where('type', '==', 'delivery')
      .where('date', '>', state[0].startDate)
      .where('date', '<', state[0].endDate)
      .where('createdBy', '==', user)
      .get();

    const deliveries = deliveriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    list.push(...deliveries);

    // Fetch shipping papers
    const shippingSnap = await fire
      .firestore()
      .collection('asset_data')
      .where('type', '==', 'shipping_papers')
      .where('date', '>', state[0].startDate)
      .where('date', '<', state[0].endDate)
      .where('createdby', '==', user)
      .get();

    const shipping = shippingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    list.push(...shipping);

    // Format dates
    const formattedList = list.map(item => ({
      ...item,
      date: item.date ? moment(item.date.toDate()).format("MM/DD/YY") : ''
    }));

    setData(formattedList);
  };

  useEffect(() => {
    const unsubscribe = fire.firestore().collection('users')
      .onSnapshot(snapshot => {
        const userdata = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userdata);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h3" component="h2" gutterBottom>
        User Report
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs>
          <DateRangePicker
            onChange={item => setState([item.selection])}
            ranges={state}
          />
        </Grid>
        <Grid item xs>
          <InputLabel id="user-select-label">User</InputLabel>
          <Select
            labelId="user-select-label"
            id="user-select"
            value={user}
            onChange={handleChange}
          >
            {users.map(info => (
              <MenuItem key={info.id} value={info.email}>{info.email}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs>
          <Button variant="outlined" color="primary" onClick={fetchReport}>Run Report</Button>
        </Grid>
        {data.length > 0 && (
          <Grid item xs={12}>
            <ReactHTMLTableToExcel
              id="user-report-btn"
              className="btn btn-primary"
              table="user-report-table"
              filename="User_Report"
              sheet="Sheet1"
              buttonText="Download Excel"
            />
            <table id="user-report-table" style={{ display: 'none' }}>
              <thead>
                <tr>
                  <th>Data Number</th>
                  <th>Date</th>
                  <th>Company</th>
                  <th>Lease</th>
                  <th>Well</th>
                  <th>GPS Coordinate</th>
                  <th>Comments</th>
                  <th>Origin Warehouse</th>
                  <th>Destination Warehouse</th>
                  <th>Truck Number</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.datanumber}</td>
                    <td>{row.date}</td>
                    <td>{row.company}</td>
                    <td>{row.lease}</td>
                    <td>{row.well}</td>
                    <td>{row.gps}</td>
                    <td>{row.comments}</td>
                    <td>{row.originwarehousenumber}</td>
                    <td>{row.destinationwarehousenumber}</td>
                    <td>{row.trucknumber}</td>
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

export default UserReport;
