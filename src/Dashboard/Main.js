import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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
import { baseApi } from '../store/api/baseApi';

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

export default function Main() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const chartPaperClass = clsx(classes.paperBase, classes.chartPaper);

  const handleRefresh = useCallback(() => {
    dispatch(
      baseApi.util.invalidateTags([
        'Dashboard',
        'Delivery',
        'ShippingPaper',
        'Well',
        'WarehouseChemical',
        'Report',
      ])
    );
  }, [dispatch]);

  return (
    <Container maxWidth="xl" className={classes.container}>
      <PageTitle>Dashboard Overview</PageTitle>

      <DashboardFilters onRefresh={handleRefresh} />

      <KpiRow />

      <Grid container spacing={3} className={classes.rowSpacer}>
        <Grid item xs={12} lg={8}>
          <Paper className={chartPaperClass}>
            <RevenueTrend />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper className={chartPaperClass}>
            <DeliveriesByCompany />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.rowSpacer}>
        <Grid item xs={12} lg={6}>
          <Paper className={chartPaperClass}>
            <Chart />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper className={chartPaperClass}>
            <TopChemicals />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.rowSpacer}>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperBase}>
            <Typography variant="h6" className={classes.mapHeader}>
              Active Wells
            </Typography>
            <Orders />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper className={chartPaperClass}>
            <WarehouseInventory />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.rowSpacer}>
        <Grid item xs={12} lg={5}>
          <Paper className={classes.paperBase}>
            <PendingDeliveries />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Paper className={classes.paperBase}>
            <RecentActivity />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
