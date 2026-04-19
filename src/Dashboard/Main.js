import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import PageTitle from '../components/PageTitle';
import Chart from './Chart';
import Orders from './Orders';
import DashboardFilters from './DashboardFilters';
import KpiRow from './KpiRow';
import RevenueTrend from './RevenueTrend';
import DeliveriesByCompany from './DeliveriesByCompany';
import TopChemicals from './TopChemicals';
import WarehouseInventory from './WarehouseInventory';
import RecentActivity from './RecentActivity';
import PendingDeliveries from './PendingDeliveries';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(4),
    },
  },
  paperBase: {
    padding: theme.spacing(2.5),
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  chartPaper: {
    minHeight: 360,
    [theme.breakpoints.down('sm')]: {
      minHeight: 320,
    },
  },
  mapHeader: {
    marginBottom: theme.spacing(1.5),
    color: '#0f172a',
    fontWeight: 600,
  },
  rowSpacer: {
    marginTop: theme.spacing(3),
  },
}));

const DEFAULT_RANGE = {
  startDate: startOfDay(subDays(new Date(), 29)),
  endDate: endOfDay(new Date()),
};

export default function Main() {
  const classes = useStyles();
  const chartPaperClass = clsx(classes.paperBase, classes.chartPaper);

  const [dateRange, setDateRange] = useState(DEFAULT_RANGE);
  const [companyId, setCompanyId] = useState(null);
  const [focusedCompany, setFocusedCompany] = useState({ id: null, name: null });
  const [refreshNonce, setRefreshNonce] = useState(0);

  const handleDateRangeChange = useCallback((next) => {
    setDateRange({
      startDate: startOfDay(next.startDate),
      endDate: endOfDay(next.endDate),
    });
  }, []);

  const handleCompanyChange = useCallback((id) => {
    setCompanyId(id || null);
    setFocusedCompany({ id: null, name: null });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshNonce((n) => n + 1);
  }, []);

  const handleSliceClick = useCallback((id, name) => {
    if (!id) return;
    setFocusedCompany((prev) => (prev.id === id ? { id: null, name: null } : { id, name }));
  }, []);

  const clearFocus = useCallback(() => setFocusedCompany({ id: null, name: null }), []);

  return (
    <Container maxWidth="xl" className={classes.container}>
      <PageTitle>Dashboard Overview</PageTitle>

      <DashboardFilters
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        companyId={companyId}
        onCompanyChange={handleCompanyChange}
        onRefresh={handleRefresh}
      />

      <KpiRow
        dateRange={dateRange}
        companyId={companyId}
        refreshNonce={refreshNonce}
      />

      <Grid container spacing={3} className={classes.rowSpacer}>
        <Grid item xs={12} lg={8}>
          <Paper className={chartPaperClass}>
            <RevenueTrend
              dateRange={dateRange}
              companyId={companyId}
              refreshNonce={refreshNonce}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper className={chartPaperClass}>
            <DeliveriesByCompany
              dateRange={dateRange}
              companyId={companyId}
              focusedCompanyId={focusedCompany.id}
              onSliceClick={handleSliceClick}
              refreshNonce={refreshNonce}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.rowSpacer}>
        <Grid item xs={12} lg={6}>
          <Paper className={chartPaperClass}>
            <Chart
              dateRange={dateRange}
              companyId={companyId}
              refreshNonce={refreshNonce}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper className={chartPaperClass}>
            <TopChemicals
              dateRange={dateRange}
              companyId={companyId}
              refreshNonce={refreshNonce}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.rowSpacer}>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperBase}>
            <Typography variant="h6" className={classes.mapHeader}>
              Active Wells
            </Typography>
            <Orders companyId={companyId} refreshNonce={refreshNonce} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper className={chartPaperClass}>
            <WarehouseInventory refreshNonce={refreshNonce} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.rowSpacer}>
        <Grid item xs={12} lg={5}>
          <Paper className={classes.paperBase}>
            <PendingDeliveries
              companyId={companyId}
              refreshNonce={refreshNonce}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Paper className={classes.paperBase}>
            <RecentActivity
              companyId={companyId}
              focusedCompanyId={focusedCompany.id}
              focusedCompanyName={focusedCompany.name}
              onClearFocus={clearFocus}
              refreshNonce={refreshNonce}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
