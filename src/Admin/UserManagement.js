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
import PageTitle from '../components/PageTitle';
import { useAuth } from '../config/AuthContext';
import { ROLES, assignableRoles } from '../config/permissions';
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useDeactivateUserMutation,
} from '../store/api/usersApi';
import { showToast } from '../store/slices/uiSlice';

export default function UserManagement() {
  const dispatch = useDispatch();
  const { user: currentUser } = useAuth();
  const roleOptions = assignableRoles(currentUser?.role);
  const { data, isFetching } = useGetUsersQuery({ limit: 1000 });
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [resetPassword] = useResetUserPasswordMutation();
  const [deactivateUser] = useDeactivateUserMutation();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(ROLES.USER);

  const rows = data?.data ?? [];

  const columns = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'Username', field: 'username' },
    { title: 'Full Name', field: 'fullname' },
    { title: 'Email', field: 'email', editable: 'never' },
    {
      title: 'Role',
      field: 'role',
      lookup: Object.fromEntries(roleOptions.map((r) => [r, r])),
    },
  ];

  const resetCreateForm = () => {
    setUsername('');
    setFullname('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole(ROLES.USER);
  };

  const handleCreateUser = async () => {
    if (password !== confirmPassword) {
      dispatch(showToast({ severity: 'error', message: "Passwords don't match" }));
      return;
    }
    try {
      await addUser({ username, fullname, name: fullname, email, password, role }).unwrap();
      setCreateDialogOpen(false);
      resetCreateForm();
      dispatch(showToast({ severity: 'success', message: 'User created' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to create user' }));
    }
  };

  return (
    <div>
      <PageTitle>User Management</PageTitle>
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
            tooltip: 'Email Password Reset Code',
            onClick: async (event, rowData) => {
              if (window.confirm(`Email a password reset code to ${rowData.fullname} at ${rowData.email}?`)) {
                try {
                  await resetPassword(rowData.id).unwrap();
                  dispatch(showToast({
                    severity: 'success',
                    message: `A 6-digit reset code has been emailed to ${rowData.email}. It expires in 10 minutes.`,
                  }));
                } catch (err) {
                  dispatch(showToast({
                    severity: 'error',
                    message: err?.message || 'Could not send the reset code',
                  }));
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
                  await deactivateUser(rowData.id).unwrap();
                  dispatch(showToast({ severity: 'success', message: 'User deactivated' }));
                } catch (err) {
                  dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to deactivate user' }));
                }
              }
            },
          },
        ]}
        editable={{
          onRowUpdate: async (newData, oldData) => {
            try {
              await updateUser({
                id: oldData.id,
                username: newData.username,
                fullname: newData.fullname,
                role: newData.role,
              }).unwrap();
              dispatch(showToast({ severity: 'success', message: 'User updated' }));
            } catch (err) {
              dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update user' }));
            }
          },
        }}
      />

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="dense" />
          <TextField label="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} fullWidth margin="dense" />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="dense" />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="dense" />
          <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel id="new-user-role-label">Role</InputLabel>
            <Select labelId="new-user-role-label" value={role} onChange={(e) => setRole(e.target.value)}>
              {roleOptions.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
