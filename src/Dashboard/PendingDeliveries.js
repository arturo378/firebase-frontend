import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import { formatDistanceToNow } from 'date-fns';
import Title from './Title';
import useDashboardData from './useDashboardData';

const useStyles = makeStyles((theme) => ({
  row: {
    borderBottom: '1px solid #f1f5f9',
  },
  ageChip: {
    fontWeight: 600,
  },
  recent: { backgroundColor: '#dcfce7', color: '#166534' },
  aging: { backgroundColor: '#fef3c7', color: '#92400e' },
  stale: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  empty: {
    padding: theme.spacing(2, 0),
  },
}));

function ageBucket(iso) {
  if (!iso) return 'aging';
  const days = (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
  if (days < 3) return 'recent';
  if (days < 7) return 'aging';
  return 'stale';
}

export default function PendingDeliveries({ companyId, refreshNonce }) {
  const classes = useStyles();
  const companyQ = companyId ? `&company=${companyId}` : '';
  const { data, loading, error } = useDashboardData(
    `/api/deliveries?active=0&limit=10${companyQ}`,
    [refreshNonce]
  );

  const items = useMemo(() => {
    const rows = Array.isArray(data?.data) ? data.data : [];
    return rows.slice(0, 10);
  }, [data]);

  return (
    <React.Fragment>
      <Title>Pending Deliveries</Title>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <CircularProgress size={24} />
        </div>
      ) : error ? (
        <Typography variant="body2" color="error">Failed to load.</Typography>
      ) : items.length === 0 ? (
        <Typography variant="body2" color="textSecondary" className={classes.empty}>
          No pending deliveries — you're caught up.
        </Typography>
      ) : (
        <List dense disablePadding>
          {items.map((d) => {
            const bucket = ageBucket(d.date);
            return (
              <ListItem key={d.id} className={classes.row} disableGutters>
                <ListItemText
                  primary={
                    <span>
                      <strong>{d.datanumber}</strong>
                      <span style={{ color: '#64748b', marginLeft: 8 }}>
                        {d.company?.name || ''}
                      </span>
                    </span>
                  }
                  secondary={[d.lease?.name, d.well?.name].filter(Boolean).join(' • ') || '—'}
                />
                <Chip
                  size="small"
                  label={d.date ? formatDistanceToNow(new Date(d.date), { addSuffix: true }) : 'unknown'}
                  className={`${classes.ageChip} ${classes[bucket]}`}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </React.Fragment>
  );
}
