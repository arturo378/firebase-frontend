import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { DateRange } from 'react-date-range';
import { makeStyles } from '@material-ui/core/styles';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TablePagination from '@material-ui/core/TablePagination';
import DateRangeIcon from '@material-ui/icons/DateRange';
import RefreshIcon from '@material-ui/icons/Refresh';
import GetAppIcon from '@material-ui/icons/GetApp';
import BusinessIcon from '@material-ui/icons/Business';
import MaterialTable from 'material-table';
import moment from 'moment';
import { format, startOfMonth, endOfMonth, subMonths, addDays } from 'date-fns';
import * as XLSX from 'xlsx';
import PageTitle from '../components/PageTitle';
import api from '../config/api';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// material-table 1.69 still uses deprecated MUI pagination prop names.
// Translate them so @material-ui/core 4.11's TablePagination stops warning.
function PatchedPagination(props) {
  const { onChangePage, onChangeRowsPerPage, ...rest } = props;
  return (
    <TablePagination
      {...rest}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
    />
  );
}

const PRESETS = {
  last7: 'Last 7 days',
  last30: 'Last 30 days',
  thisMonth: 'This Month',
  lastMonth: 'Last Month',
  custom: 'Custom…',
};

function rangeForPreset(key) {
  const today = new Date();
  switch (key) {
    case 'last7':
      return { startDate: addDays(today, -6), endDate: today };
    case 'last30':
      return { startDate: addDays(today, -29), endDate: today };
    case 'thisMonth':
      return { startDate: startOfMonth(today), endDate: today };
    case 'lastMonth': {
      const prev = subMonths(today, 1);
      return { startDate: startOfMonth(prev), endDate: endOfMonth(prev) };
    }
    default:
      return null;
  }
}

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
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
    minWidth: 160,
  },
  companySelect: {
    minWidth: 220,
  },
  spacer: { flexGrow: 1 },
  statusSlot: {
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 24,
    color: theme.palette.text.secondary,
  },
  refresh: { color: '#1e40af' },
  pickerBox: { padding: theme.spacing(1) },
  summaryTile: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  summaryLabel: {
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontWeight: 600,
    marginTop: theme.spacing(0.5),
  },
  resultsArea: { marginTop: theme.spacing(2) },
  emptyState: {
    padding: theme.spacing(6, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: '1px dashed #cbd5e1',
    borderRadius: 14,
    backgroundColor: '#f8fafc',
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.4,
    marginBottom: theme.spacing(1),
  },
  errorBanner: {
    padding: theme.spacing(1.5, 2),
    borderLeft: `4px solid ${theme.palette.error.main}`,
    color: theme.palette.error.dark,
    marginBottom: theme.spacing(2),
  },
}));

function WeeklyEarnings() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState('');
  const [preset, setPreset] = useState('last7');
  const [range, setRange] = useState(() => rangeForPreset('last7'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const requestIdRef = useRef(0);
  const debounceRef = useRef(null);

  useEffect(() => {
    api.get('/api/companies?limit=100')
      .then(res => setCompanies(Array.isArray(res?.data) ? res.data : []))
      .catch(console.error);
  }, []);

  const runReport = useCallback(async () => {
    if (!company) return;
    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const startDate = range.startDate.toISOString();
      const endDate = range.endDate.toISOString();
      const result = await api.get(
        `/api/reports/weekly-earnings?startDate=${startDate}&endDate=${endDate}&company=${company}`
      );
      if (reqId !== requestIdRef.current) return;
      const rows = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];
      setData(rows);
      setHasRun(true);
    } catch (err) {
      if (reqId !== requestIdRef.current) return;
      console.error(err);
      setError(err?.message || 'Failed to load report');
      setData([]);
      setHasRun(true);
    } finally {
      if (reqId === requestIdRef.current) setLoading(false);
    }
  }, [company, range]);

  // Auto-run with debounce when filters change
  useEffect(() => {
    if (!company) {
      setData([]);
      setHasRun(false);
      return undefined;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { runReport(); }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [company, range, runReport]);

  const totals = useMemo(() => {
    const totalRevenue = data.reduce((s, r) => s + (Number(r.total) || 0), 0);
    const totalQuantity = data.reduce((s, r) => s + (Number(r.quantity) || 0), 0);
    return { totalRevenue, totalQuantity, rowCount: data.length };
  }, [data]);

  const handlePresetChange = (event) => {
    const key = event.target.value;
    setPreset(key);
    if (key === 'custom') {
      // Open the calendar for custom selection; keep current range
      return;
    }
    const next = rangeForPreset(key);
    if (next) setRange(next);
  };

  const handleCalendarChange = (item) => {
    setRange({
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
    });
    setPreset('custom');
  };

  const exportToExcel = () => {
    const selectedCompany = companies.find(c => c.id === company);
    const rows = [
      ['Data Number', 'Date', 'Company', 'Lease', 'Well', 'GPS Coordinate', 'Chemical', 'Price', 'Quantity', 'Total'],
      ...data.map((row) => [
        row.datanumber,
        row.date ? moment(row.date).format('MM/DD/YY') : '',
        selectedCompany?.name || '',
        row.lease,
        row.well,
        row.gps,
        row.chemical,
        row.price,
        row.quantity,
        row.total,
      ]),
      [],
      ['', '', '', '', '', '', 'Totals', '', totals.totalQuantity, totals.totalRevenue],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Weekly_Report.xlsx');
  };

  const columns = [
    {
      title: 'Date',
      field: 'date',
      render: row => (row.date ? moment(row.date).format('MM/DD/YY') : ''),
    },
    { title: 'Data #', field: 'datanumber' },
    { title: 'Lease', field: 'lease' },
    { title: 'Well', field: 'well' },
    { title: 'Chemical', field: 'chemical' },
    { title: 'Qty', field: 'quantity', type: 'numeric' },
    {
      title: 'Price',
      field: 'price',
      type: 'numeric',
      render: row => (row.price != null ? currencyFormatter.format(row.price) : ''),
    },
    {
      title: 'Total',
      field: 'total',
      type: 'numeric',
      render: row => (row.total != null ? currencyFormatter.format(row.total) : ''),
    },
  ];

  const dateLabel = `${format(range.startDate, 'MMM d, yyyy')} — ${format(range.endDate, 'MMM d, yyyy')}`;

  const renderResults = () => {
    if (!company) {
      return (
        <div className={classes.emptyState}>
          <BusinessIcon className={classes.emptyIcon} />
          <Typography variant="h6">Choose a company to load earnings</Typography>
          <Typography variant="body2">
            Pick a company from the toolbar above. The report will load automatically.
          </Typography>
        </div>
      );
    }
    if (error) {
      return <Paper className={classes.errorBanner}>{error}</Paper>;
    }
    if (!loading && hasRun && data.length === 0) {
      return (
        <div className={classes.emptyState}>
          <Typography variant="h6">No earnings in this range</Typography>
          <Typography variant="body2">Try a wider date range or a different company.</Typography>
        </div>
      );
    }
    if (loading && data.length === 0) {
      return (
        <div className={classes.emptyState}>
          <CircularProgress size={28} />
          <Typography variant="body2" style={{ marginTop: 8 }}>Loading earnings…</Typography>
        </div>
      );
    }
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.summaryTile}>
              <div className={classes.summaryLabel}>Total Revenue</div>
              <Typography variant="h5" className={classes.summaryValue}>
                {currencyFormatter.format(totals.totalRevenue)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.summaryTile}>
              <div className={classes.summaryLabel}>Total Quantity</div>
              <Typography variant="h5" className={classes.summaryValue}>
                {totals.totalQuantity}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.summaryTile}>
              <div className={classes.summaryLabel}>Rows</div>
              <Typography variant="h5" className={classes.summaryValue}>
                {totals.rowCount}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <div style={{ marginTop: 16 }}>
          <MaterialTable
            title=""
            columns={columns}
            data={data}
            components={{ Pagination: PatchedPagination }}
            actions={[
              {
                icon: () => <GetAppIcon />,
                tooltip: 'Download Excel',
                isFreeAction: true,
                onClick: exportToExcel,
              },
            ]}
            options={{
              pageSize: 10,
              pageSizeOptions: [10, 25, 50],
              search: true,
              sorting: true,
              toolbar: true,
              showTitle: false,
              actionsColumnIndex: -1,
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div className={classes.root}>
      <PageTitle>Earnings Report</PageTitle>

      <div className={classes.bar}>
        <FormControl variant="outlined" size="small" className={classes.select}>
          <InputLabel id="preset-label">Range</InputLabel>
          <Select
            labelId="preset-label"
            value={preset}
            onChange={handlePresetChange}
            label="Range"
          >
            {Object.entries(PRESETS).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<DateRangeIcon />}
          className={classes.dateButton}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {dateLabel}
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
              ranges={[{ ...range, key: 'selection' }]}
              onChange={handleCalendarChange}
              moveRangeOnFirstSelection={false}
              editableDateInputs
            />
          </div>
        </Popover>

        <FormControl variant="outlined" size="small" className={classes.companySelect}>
          <InputLabel id="company-label">Company</InputLabel>
          <Select
            labelId="company-label"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            label="Company"
          >
            <MenuItem value="" style={{ display: 'none' }} />
            {companies.map(info => (
              <MenuItem key={info.id} value={info.id}>{info.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <span className={classes.statusSlot}>
          {loading && <CircularProgress size={18} />}
        </span>

        <div className={classes.spacer} />

        <Tooltip title="Refresh">
          <span>
            <IconButton
              className={classes.refresh}
              onClick={runReport}
              disabled={!company || loading}
              aria-label="Refresh"
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      <div className={classes.resultsArea}>
        {renderResults()}
      </div>
    </div>
  );
}

export default WeeklyEarnings;
