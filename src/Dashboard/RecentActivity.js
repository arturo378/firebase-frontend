import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DescriptionIcon from '@material-ui/icons/Description';
import { format } from 'date-fns';
import Title from './Title';
import { useGetDeliveriesQuery } from '../store/api/deliveriesApi';
import { useGetShippingPapersQuery } from '../store/api/shippingPapersApi';
import {
  selectCompanyId,
  selectFocusedCompany,
  clearFocusedCompany,
} from '../store/slices/dashboardFiltersSlice';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
  },
  chip: {
    marginLeft: theme.spacing(1),
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontWeight: 600,
  },
  avatarDelivery: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  avatarShipping: {
    backgroundColor: '#ede9fe',
    color: '#6d28d9',
  },
  empty: {
    padding: theme.spacing(2, 0),
  },
}));

export default function RecentActivity() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const companyId = useSelector(selectCompanyId);
  const focusedCompany = useSelector(selectFocusedCompany);

  const deliveries = useGetDeliveriesQuery({ limit: 20, company: companyId || undefined });
  const shipping = useGetShippingPapersQuery({ limit: 20 });

  const items = useMemo(() => {
    const dRows = Array.isArray(deliveries.data?.data) ? deliveries.data.data : [];
    const sRows = Array.isArray(shipping.data?.data) ? shipping.data.data : [];
    const merged = [
      ...dRows
        .filter((d) => !focusedCompany.id || d.company?.id === focusedCompany.id)
        .map((d) => ({
          kind: 'delivery',
          id: d.id,
          datanumber: d.datanumber,
          date: d.date,
          primary: d.company?.name || 'Delivery',
          secondary: [d.lease?.name, d.well?.name].filter(Boolean).join(' • '),
        })),
      ...sRows.map((s) => ({
        kind: 'shipping',
        id: s.id,
        datanumber: s.datanumber,
        date: s.date,
        primary: 'Shipping Paper',
        secondary: `#${s.trucknumber || '—'} • ${s.originwarehousenumber || ''} → ${s.destinationwarehousenumber || ''}`,
      })),
    ];
    merged.sort((a, b) => {
      const at = a.date ? new Date(a.date).getTime() : 0;
      const bt = b.date ? new Date(b.date).getTime() : 0;
      return bt - at;
    });
    return merged.slice(0, 10);
  }, [deliveries.data, shipping.data, focusedCompany]);

  const loading = deliveries.isFetching || shipping.isFetching;

  return (
    <React.Fragment>
      <div className={classes.header}>
        <Title>Recent Activity</Title>
        {focusedCompany.id && (
          <Chip
            label={`Filtered: ${focusedCompany.name || 'company'}`}
            onDelete={() => dispatch(clearFocusedCompany())}
            className={classes.chip}
            size="small"
          />
        )}
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <CircularProgress size={24} />
        </div>
      ) : items.length === 0 ? (
        <Typography variant="body2" color="textSecondary" className={classes.empty}>
          No recent activity.
        </Typography>
      ) : (
        <List dense disablePadding>
          {items.map((item) => (
            <ListItem key={`${item.kind}-${item.id}`} disableGutters>
              <ListItemAvatar>
                <Avatar className={item.kind === 'delivery' ? classes.avatarDelivery : classes.avatarShipping}>
                  {item.kind === 'delivery' ? <LocalShippingIcon /> : <DescriptionIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <span>
                    <strong>{item.datanumber}</strong>
                    <span style={{ color: '#64748b', marginLeft: 8 }}>{item.primary}</span>
                  </span>
                }
                secondary={
                  <span>
                    {item.secondary}
                    {item.date && (
                      <span style={{ color: '#94a3b8', marginLeft: 8 }}>
                        {format(new Date(item.date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </React.Fragment>
  );
}
