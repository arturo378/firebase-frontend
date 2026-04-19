import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  action: {
    padding: theme.spacing(2.25, 2.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
    minHeight: 116,
  },
  label: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 32,
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.1,
  },
  hint: {
    color: '#64748b',
    fontSize: 12,
  },
  accent: (props) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: props.accent || '#dbeafe',
    color: props.accentText || '#1e40af',
    marginBottom: theme.spacing(0.5),
  }),
}));

export default function KpiCard({
  label,
  value,
  hint,
  icon,
  to,
  loading,
  error,
  accent,
  accentText,
}) {
  const classes = useStyles({ accent, accentText });

  const body = (
    <div className={classes.action}>
      {icon && <span className={classes.accent}>{icon}</span>}
      <Typography className={classes.label}>{label}</Typography>
      {loading ? (
        <CircularProgress size={22} thickness={5} />
      ) : error ? (
        <Typography className={classes.value} style={{ color: '#dc2626', fontSize: 18 }}>
          Error
        </Typography>
      ) : (
        <Typography className={classes.value}>{value ?? '—'}</Typography>
      )}
      {hint && <Typography className={classes.hint}>{hint}</Typography>}
    </div>
  );

  return (
    <Paper elevation={0} className={classes.paper}>
      {to ? (
        <CardActionArea component={Link} to={to}>
          {body}
        </CardActionArea>
      ) : (
        body
      )}
    </Paper>
  );
}
