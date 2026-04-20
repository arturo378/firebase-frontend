import React, { useState, useMemo } from 'react';
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
import PersonIcon from '@material-ui/icons/Person';
import MaterialTable from 'material-table';
import moment from 'moment';
import { format, startOfMonth, endOfMonth, subMonths, addDays } from 'date-fns';
import PageTitle from '../components/PageTitle';
import { useGetUsersQuery } from '../store/api/usersApi';
import { useGetUserActivityQuery } from '../store/api/reportsApi';
import { exportAoaToXlsx } from '../config/excelExport';

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
  select: { minWidth: 160 },
  userSelect: { minWidth: 260 },
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

function mergeActivity(result) {
  const deliveries = Array.isArray(result?.deliveries) ? result.deliveries : [];
  const shipping = Array.isArray(result?.shippingPapers) ? result.shippingPapers : [];
  return [
    ...deliveries.map(d => ({ ...d, _recordType: 'Delivery' })),
    ...shipping.map(s => ({ ...s, _recordType: 'Shipping Paper' })),
  ];
}

function UserReport() {
  const classes = useStyles();
  const [userId, setUserId] = useState('');
  const [preset, setPreset] = useState('last7');
  const [range, setRange] = useState(() => rangeForPreset('last7'));
  const [anchorEl, setAnchorEl] = useState(null);

  const { data: usersData } = useGetUsersQuery({ limit: 100 });
  const users = usersData?.data ?? [];

  const queryArgs = userId
    ? {
        startDate: range.startDate.toISOString(),
        endDate: range.endDate.toISOString(),
        userId,
      }
    : undefined;

  const { data: reportData, isFetching, error, isSuccess, refetch } =
    useGetUserActivityQuery(queryArgs, { skip: !userId });

  const data = useMemo(() => mergeActivity(reportData), [reportData]);

  const totals = useMemo(() => {
    const deliveries = data.filter(r => r._recordType === 'Delivery').length;
    const shipping = data.filter(r => r._recordType === 'Shipping Paper').length;
    return { deliveries, shipping, rowCount: data.length };
  }, [data]);

  const handlePresetChange = (event) => {
    const key = event.target.value;
    setPreset(key);
    if (key === 'custom') return;
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

  const exportToExcel = async () => {
    const rows = [
      ['Data Number', 'Date', 'Type', 'Company', 'Lease', 'Well', 'GPS Coordinate', 'Comments', 'Origin Warehouse', 'Destination Warehouse', 'Truck Number'],
      ...data.map((row) => [
        row.datanumber,
        row.date ? moment(row.date).format('MM/DD/YY') : '',
        row._recordType,
        row.company?.name || '',
        row.lease?.name || '',
        row.well?.name || '',
        row.gps,
        row.comments,
        row.originwarehousenumber,
        row.destinationwarehousenumber,
        row.trucknumber,
      ]),
    ];
    await exportAoaToXlsx(rows, 'User_Report.xlsx');
  };

  const columns = [
    {
      title: 'Date',
      field: 'date',
      render: row => (row.date ? moment(row.date).format('MM/DD/YY') : ''),
    },
    { title: 'Data #', field: 'datanumber' },
    { title: 'Type', field: '_recordType' },
    { title: 'Company', field: 'company.name', render: row => row.company?.name || '' },
    { title: 'Lease', field: 'lease.name', render: row => row.lease?.name || '' },
    { title: 'Well', field: 'well.name', render: row => row.well?.name || '' },
    { title: 'Truck #', field: 'trucknumber' },
    { title: 'Comments', field: 'comments' },
  ];

  const dateLabel = `${format(range.startDate, 'MMM d, yyyy')} — ${format(range.endDate, 'MMM d, yyyy')}`;

  const renderResults = () => {
    if (!userId) {
      return (
        <div className={classes.emptyState}>
          <PersonIcon className={classes.emptyIcon} />
          <Typography variant="h6">Choose a user to load activity</Typography>
          <Typography variant="body2">
            Pick a user from the toolbar above. The report will load automatically.
          </Typography>
        </div>
      );
    }
    if (error) {
      return <Paper className={classes.errorBanner}>{error.message || 'Failed to load report'}</Paper>;
    }
    if (!isFetching && isSuccess && data.length === 0) {
      return (
        <div className={classes.emptyState}>
          <Typography variant="h6">No activity in this range</Typography>
          <Typography variant="body2">Try a wider date range or a different user.</Typography>
        </div>
      );
    }
    if (isFetching && data.length === 0) {
      return (
        <div className={classes.emptyState}>
          <CircularProgress size={28} />
          <Typography variant="body2" style={{ marginTop: 8 }}>Loading activity…</Typography>
        </div>
      );
    }
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.summaryTile}>
              <div className={classes.summaryLabel}>Total Records</div>
              <Typography variant="h5" className={classes.summaryValue}>
                {totals.rowCount}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.summaryTile}>
              <div className={classes.summaryLabel}>Deliveries</div>
              <Typography variant="h5" className={classes.summaryValue}>
                {totals.deliveries}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.summaryTile}>
              <div className={classes.summaryLabel}>Shipping Papers</div>
              <Typography variant="h5" className={classes.summaryValue}>
                {totals.shipping}
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
      <PageTitle>User Report</PageTitle>

      <div className={classes.bar}>
        <FormControl variant="outlined" size="small" className={classes.select}>
          <InputLabel id="user-preset-label">Range</InputLabel>
          <Select
            labelId="user-preset-label"
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

        <FormControl variant="outlined" size="small" className={classes.userSelect}>
          <InputLabel id="user-label">User</InputLabel>
          <Select
            labelId="user-label"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            label="User"
          >
            <MenuItem value="" style={{ display: 'none' }} />
            {users.map(info => (
              <MenuItem key={info.id} value={info.id}>{info.email}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <span className={classes.statusSlot}>
          {isFetching && <CircularProgress size={18} />}
        </span>

        <div className={classes.spacer} />

        <Tooltip title="Refresh">
          <span>
            <IconButton
              className={classes.refresh}
              onClick={() => refetch()}
              disabled={!userId || isFetching}
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

export default UserReport;
