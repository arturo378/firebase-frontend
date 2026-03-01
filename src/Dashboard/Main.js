import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from './Chart';
import Orders from './Orders';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(4),
    },
  },
  heroCard: {
    padding: theme.spacing(2.5, 3),
    borderRadius: 16,
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(120deg, #0f172a 0%, #1e3a8a 100%)',
    color: '#f8fafc',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.25),
    },
  },
  heroTitle: {
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    marginTop: theme.spacing(0.75),
    color: 'rgba(248, 250, 252, 0.86)',
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
}));

export default function Main() {
  const classes = useStyles();
  const chartPaperClass = clsx(classes.paperBase, classes.chartPaper);

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Paper elevation={0} className={classes.heroCard}>
        <Typography variant="h5" className={classes.heroTitle}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" className={classes.heroSubtitle}>
          Monitor deliveries and well activity in real time across all screen sizes.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper className={chartPaperClass}>
            <Chart />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper className={classes.paperBase}>
            <Typography variant="h6" className={classes.mapHeader}>
              Active Wells
            </Typography>
            <Orders />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}