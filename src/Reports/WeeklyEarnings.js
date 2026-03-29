import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { addDays } from 'date-fns';
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

function WeeklyEarnings() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState('');
  const [state, setState] = useState([{
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  }]);

  const handleChange = (event) => setCompany(event.target.value);

  const fetchReport = async () => {
    if (!company) return;
    try {
      const startDate = state[0].startDate.toISOString();
      const endDate = state[0].endDate.toISOString();
      const result = await api.get(
        `/api/reports/weekly-earnings?startDate=${startDate}&endDate=${endDate}&company=${company}`
      );
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  const exportToExcel = () => {
    const selectedCompany = companies.find(c => c.id === company);
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Data Number', 'Date', 'Company', 'Lease', 'Well', 'GPS Coordinate', 'Chemical', 'Price', 'Quantity', 'Total'],
      ...data.map((row) => [
        row.datanumber,
        row.date ? moment(row.date).format("MM/DD/YY") : '',
        selectedCompany?.name || '',
        row.lease,
        row.well,
        row.gps,
        row.chemical,
        row.price,
        row.quantity,
        row.total,
      ]),
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Weekly_Report.xlsx');
  };

  useEffect(() => {
    api.get('/api/companies').then(setCompanies).catch(console.error);
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

export default WeeklyEarnings;
