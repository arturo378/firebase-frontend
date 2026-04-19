import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { format } from 'date-fns';
import api from '../config/api';

const useStyles = makeStyles((theme) => ({
  bar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.75, 2),
    borderRadius: 14,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
    marginBottom: theme.spacing(3),
  },
  dateButton: {
    textTransform: 'none',
    borderRadius: 10,
    borderColor: '#cbd5e1',
    color: '#0f172a',
    fontWeight: 500,
    padding: theme.spacing(0.75, 1.5),
    backgroundColor: '#f8fafc',
  },
  select: {
    minWidth: 200,
  },
  refresh: {
    marginLeft: 'auto',
    color: '#1e40af',
  },
  pickerBox: {
    padding: theme.spacing(1),
  },
}));

export default function DashboardFilters({
  dateRange,
  onDateRangeChange,
  companyId,
  onCompanyChange,
  onRefresh,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    let cancelled = false;
    api.get('/api/companies?limit=100')
      .then((res) => {
        if (cancelled) return;
        setCompanies(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => { /* silent — dropdown stays empty */ });
    return () => { cancelled = true; };
  }, []);

  const label = `${format(dateRange.startDate, 'MMM d, yyyy')} — ${format(dateRange.endDate, 'MMM d, yyyy')}`;

  return (
    <div className={classes.bar}>
      <Button
        variant="outlined"
        startIcon={<DateRangeIcon />}
        className={classes.dateButton}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {label}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <div className={classes.pickerBox}>
          <DateRange
            ranges={[{ ...dateRange, key: 'selection' }]}
            onChange={(item) => onDateRangeChange({
              startDate: item.selection.startDate,
              endDate: item.selection.endDate,
            })}
            moveRangeOnFirstSelection={false}
            editableDateInputs
          />
        </div>
      </Popover>

      <FormControl variant="outlined" size="small" className={classes.select}>
        <InputLabel id="dashboard-company-label">Company</InputLabel>
        <Select
          labelId="dashboard-company-label"
          value={companyId || ''}
          onChange={(e) => onCompanyChange(e.target.value || null)}
          label="Company"
        >
          <MenuItem value=""><em>All companies</em></MenuItem>
          {companies.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip title="Refresh all widgets">
        <IconButton className={classes.refresh} onClick={onRefresh} aria-label="Refresh">
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
