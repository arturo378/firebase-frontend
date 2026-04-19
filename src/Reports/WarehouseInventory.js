import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TablePagination from '@material-ui/core/TablePagination';
import RefreshIcon from '@material-ui/icons/Refresh';
import GetAppIcon from '@material-ui/icons/GetApp';
import StorageIcon from '@material-ui/icons/Storage';
import MaterialTable from 'material-table';
import PageTitle from '../components/PageTitle';
import api from '../config/api';
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
  warehouseSelect: { minWidth: 260 },
  spacer: { flexGrow: 1 },
  statusSlot: {
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 24,
    color: theme.palette.text.secondary,
  },
  refresh: { color: '#1e40af' },
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

function WarehouseInventory() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouse, setWarehouse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const requestIdRef = useRef(0);
  const debounceRef = useRef(null);

  useEffect(() => {
    api.get('/api/warehouses?limit=100')
      .then(res => setWarehouses(Array.isArray(res?.data) ? res.data : []))
      .catch(console.error);
  }, []);

  const runReport = useCallback(async () => {
    if (!warehouse) return;
    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(`/api/reports/warehouse-inventory?warehouse=${warehouse}`);
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
  }, [warehouse]);

  useEffect(() => {
    if (!warehouse) {
      setData([]);
      setHasRun(false);
      return undefined;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { runReport(); }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [warehouse, runReport]);

  const totals = useMemo(() => {
    const totalQuantity = data.reduce((s, r) => s + (Number(r.quantity) || 0), 0);
    const uniqueChemicals = new Set(data.map(r => r.chemical).filter(Boolean)).size;
    return { totalQuantity, uniqueChemicals, rowCount: data.length };
  }, [data]);

  const exportToExcel = async () => {
    const rows = [
      ['Warehouse', 'Chemical', 'Quantity', 'Area Manager'],
      ...data.map((row) => [
        row.warehouse,
        row.chemical,
        row.quantity,
        row.areamanager,
      ]),
      [],
      ['', 'Totals', totals.totalQuantity, ''],
    ];
    await exportAoaToXlsx(rows, 'Warehouse_Inventory_Report.xlsx');
  };

  const columns = [
    { title: 'Warehouse', field: 'warehouse' },
    { title: 'Chemical', field: 'chemical' },
    { title: 'Quantity', field: 'quantity', type: 'numeric' },
    { title: 'Area Manager', field: 'areamanager' },
  ];

  const renderResults = () => {
    if (!warehouse) {
      return (
        <div className={classes.emptyState}>
          <StorageIcon className={classes.emptyIcon} />
          <Typography variant="h6">Choose a warehouse to load inventory</Typography>
          <Typography variant="body2">
            Pick a warehouse from the toolbar above. The report will load automatically.
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
          <Typography variant="h6">No inventory records for this warehouse</Typography>
          <Typography variant="body2">Try a different warehouse.</Typography>
        </div>
      );
    }
    if (loading && data.length === 0) {
      return (
        <div className={classes.emptyState}>
          <CircularProgress size={28} />
          <Typography variant="body2" style={{ marginTop: 8 }}>Loading inventory…</Typography>
        </div>
      );
    }
    return (
      <>
        <Grid container spacing={2}>
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
              <div className={classes.summaryLabel}>Unique Chemicals</div>
              <Typography variant="h5" className={classes.summaryValue}>
                {totals.uniqueChemicals}
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
      <PageTitle>Inventory Levels</PageTitle>

      <div className={classes.bar}>
        <FormControl variant="outlined" size="small" className={classes.warehouseSelect}>
          <InputLabel id="warehouse-label">Warehouse</InputLabel>
          <Select
            labelId="warehouse-label"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            label="Warehouse"
          >
            <MenuItem value="" style={{ display: 'none' }} />
            {warehouses.map(info => (
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
              disabled={!warehouse || loading}
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

export default WarehouseInventory;
