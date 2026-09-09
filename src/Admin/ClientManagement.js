import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable from '../config/MaterialTable';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import PageTitle from '../components/PageTitle';
import {
  useGetClientsQuery,
  useGetClientQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeactivateClientMutation,
} from '../store/api/clientsApi';
import { showToast } from '../store/slices/uiSlice';

const columns = [
  { title: 'id', field: 'id', hidden: true },
  { title: 'Name', field: 'name' },
  { title: 'Code', field: 'code', editable: 'never' },
  { title: 'Status', field: 'status', editable: 'never' },
  { title: 'Contact Email', field: 'contactEmail' },
  { title: 'Phone', field: 'phone' },
  { title: 'City', field: 'city' },
  { title: 'State', field: 'state' },
  { title: 'Zip', field: 'zip' },
];

export default function ClientManagement() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const { data, isFetching } = useGetClientsQuery({ status: status || undefined, q: q || undefined, limit: 1000 });
  const [addClient] = useAddClientMutation();
  const [updateClient] = useUpdateClientMutation();
  const [deactivateClient] = useDeactivateClientMutation();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');

  const [viewingId, setViewingId] = useState(null);
  const { data: viewingClient } = useGetClientQuery(viewingId, { skip: !viewingId });

  const rows = data?.data ?? [];

  const resetCreateForm = () => {
    setName('');
    setCode('');
    setContactEmail('');
    setPhone('');
    setCity('');
    setState('');
    setZip('');
    setNotes('');
  };

  const handleCreateClient = async () => {
    if (!name || !code) {
      dispatch(showToast({ severity: 'warning', message: 'Please enter name and code' }));
      return;
    }
    try {
      await addClient({ name, code, contactEmail, phone, city, state, zip, notes }).unwrap();
      setCreateDialogOpen(false);
      resetCreateForm();
      dispatch(showToast({ severity: 'success', message: 'Client added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add client' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    try {
      await updateClient({
        id: oldData.id,
        name: incoming.name,
        contactEmail: incoming.contactEmail,
        phone: incoming.phone,
        city: incoming.city,
        state: incoming.state,
        zip: incoming.zip,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Client updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update client' }));
    }
  };

  const toggleActive = async (row) => {
    try {
      if (row.status === 'active') {
        await deactivateClient(row.id).unwrap();
        dispatch(showToast({ severity: 'success', message: 'Client deactivated' }));
      } else {
        await updateClient({ id: row.id, status: 'active' }).unwrap();
        dispatch(showToast({ severity: 'success', message: 'Client reactivated' }));
      }
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update client status' }));
    }
  };

  return (
    <div>
      <PageTitle>Client Management</PageTitle>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <FormControl variant="outlined" size="small" style={{ minWidth: 160 }}>
          <InputLabel id="client-status-label">Status</InputLabel>
          <Select
            labelId="client-status-label"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          size="small"
          label="Search"
          placeholder="Name or code"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <MaterialTable
        columns={columns}
        data={rows}
        isLoading={isFetching}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          search: false,
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowUpdate: (newData, oldData) => updateitem(oldData, newData),
        }}
        actions={[
          {
            icon: 'add',
            tooltip: 'Create New Client',
            isFreeAction: true,
            onClick: () => {
              resetCreateForm();
              setCreateDialogOpen(true);
            },
          },
          {
            icon: 'visibility',
            tooltip: 'View Details',
            onClick: (event, rowData) => setViewingId(rowData.id),
          },
          (rowData) => ({
            icon: rowData.status === 'active' ? 'block' : 'check_circle',
            tooltip: rowData.status === 'active' ? 'Deactivate' : 'Reactivate',
            onClick: (event, rowD) => {
              if (window.confirm(`${rowD.status === 'active' ? 'Deactivate' : 'Reactivate'} client ${rowD.name}?`)) {
                toggleActive(rowD);
              }
            },
          }),
        ]}
      />

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New Client</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="dense" />
          <TextField
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            margin="dense"
            helperText="Uppercased and permanent once created"
          />
          <TextField label="Contact Email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} fullWidth margin="dense" />
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth margin="dense" />
          <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth margin="dense" />
          <TextField label="State" value={state} onChange={(e) => setState(e.target.value)} fullWidth margin="dense" />
          <TextField label="Zip" value={zip} onChange={(e) => setZip(e.target.value)} fullWidth margin="dense" />
          <TextField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth margin="dense" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateClient} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(viewingId)} onClose={() => setViewingId(null)}>
        <DialogTitle>{viewingClient?.name || 'Client details'}</DialogTitle>
        <DialogContent>
          {viewingClient ? (
            <>
              <Typography variant="body2">Users: {viewingClient.counts?.users ?? 0}</Typography>
              <Typography variant="body2">Companies: {viewingClient.counts?.companies ?? 0}</Typography>
              <Typography variant="body2">Deliveries: {viewingClient.counts?.deliveries ?? 0}</Typography>
            </>
          ) : (
            <Typography variant="body2">Loading…</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
