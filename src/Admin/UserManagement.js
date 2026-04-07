import React, { useState, useRef } from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import api from '../config/api';

const columns = [
  { title: 'id', field: 'id', hidden: true },
  { title: 'Username', field: 'username' },
  { title: 'Full Name', field: 'fullname' },
  { title: 'Email', field: 'email', editable: 'never' },
];

export default function UserManagement() {
  const tableRef = useRef();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetCreateForm = () => {
    setUsername('');
    setFullname('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const refreshTable = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  const fetchUsers = (query) => {
    const page = query.page + 1;
    const limit = query.pageSize;
    return api.get(`/api/users/?page=${page}&limit=${limit}`)
      .then((result) => ({
        data: result.data,
        page: query.page,
        totalCount: result.totalItems,
      }))
      .catch((err) => {
        console.error(err);
        return { data: [], page: 0, totalCount: 0 };
      });
  };

  const handleCreateUser = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      await api.post('/api/users', { username, fullname, name: fullname, email, password });
      setCreateDialogOpen(false);
      resetCreateForm();
      refreshTable();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <MaterialTable
        tableRef={tableRef}
        title="User Management"
        columns={columns}
        data={fetchUsers}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          search: false,
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: 'person_add',
            tooltip: 'Create New User',
            isFreeAction: true,
            onClick: () => {
              resetCreateForm();
              setCreateDialogOpen(true);
            },
          },
          {
            icon: 'lock_open',
            tooltip: 'Reset Password',
            onClick: async (event, rowData) => {
              if (window.confirm(`Send password reset for ${rowData.fullname}?`)) {
                try {
                  await api.post(`/api/users/${rowData.id}/reset-password`);
                  alert('Password reset initiated.');
                } catch (err) {
                  console.error(err);
                }
              }
            },
          },
          {
            icon: 'block',
            tooltip: 'Deactivate User',
            onClick: async (event, rowData) => {
              if (window.confirm(`Deactivate user ${rowData.fullname}?`)) {
                try {
                  await api.patch(`/api/users/${rowData.id}/deactivate`);
                  refreshTable();
                } catch (err) {
                  console.error(err);
                }
              }
            },
          },
        ]}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve) => {
              try {
                await api.patch(`/api/users/${oldData.id}`, {
                  username: newData.username,
                  fullname: newData.fullname,
                });
              } catch (err) {
                console.error(err);
              }
              resolve();
            }),
        }}
      />

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
