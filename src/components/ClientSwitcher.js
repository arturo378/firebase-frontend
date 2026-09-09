import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useAuth } from '../config/AuthContext';
import { useGetClientsQuery } from '../store/api/clientsApi';
import { baseApi } from '../store/api/baseApi';
import { setActiveClient, clearActiveClient, selectActiveClientId } from '../store/slices/clientContextSlice';
import { resetFilters } from '../store/slices/dashboardFiltersSlice';

const useStyles = makeStyles(() => ({
  root: {
    minWidth: 180,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '2px 10px',
  },
  select: {
    color: '#fff',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

// Superadmin-only AppBar control for acting on another tenant. Selecting a
// client persists it (config/clientContext.js) so every subsequent request
// carries X-Client-Id, and resets both the RTK Query cache and the dashboard
// company filter so no cross-tenant data survives the switch.
export default function ClientSwitcher() {
  const classes = useStyles();
  const { isSuperAdmin } = useAuth();
  const dispatch = useDispatch();
  const activeClientId = useSelector(selectActiveClientId);
  const { data } = useGetClientsQuery({ status: 'active', limit: 200 }, { skip: !isSuperAdmin });
  const clients = data?.data ?? [];

  if (!isSuperAdmin) return null;

  const handleChange = (e) => {
    const id = e.target.value || null;
    const client = clients.find((c) => c.id === id);
    dispatch(id ? setActiveClient({ id, name: client?.name }) : clearActiveClient());
    dispatch(baseApi.util.resetApiState());
    dispatch(resetFilters());
  };

  return (
    <FormControl className={classes.root}>
      <Select
        value={activeClientId || ''}
        onChange={handleChange}
        displayEmpty
        disableUnderline
        className={classes.select}
        classes={{ icon: classes.icon }}
      >
        <MenuItem value=""><em>My client</em></MenuItem>
        {clients.map((c) => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
