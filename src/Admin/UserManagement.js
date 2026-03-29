import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Modal from '@material-ui/core/Modal';
import Grid from "@material-ui/core/Grid";
import api from '../config/api';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '70ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function UserManagement() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [username, setUser] = useState('');
  const [fullname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [update, setUpdate] = useState(false);

  const refreshUsers = async () => {
    const result = await api.get('/api/users');
    setUsers(result);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleOpen = () => {
    setUpdate(false);
    setUser('');
    setName('');
    setEmail('');
    setPassword('');
    setconfirmPassword('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const selectItem = (i) => {
    setUpdate(true);
    setSelectedId(i.id);
    setUser(i.username || '');
    setName(i.fullname || '');
    setEmail(i.email || '');
    setOpen(true);
  };

  const deleteUser = async () => {
    try {
      await api.patch(`/api/users/${selectedId}/deactivate`);
      setOpen(false);
      await refreshUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const passwordreset = async () => {
    try {
      await api.post(`/api/users/${selectedId}/reset-password`);
      alert('Password reset initiated.');
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updatedata = async () => {
    try {
      await api.patch(`/api/users/${selectedId}`, { username, fullname });
      setOpen(false);
      await refreshUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      await api.post('/api/users', { username, fullname, name: fullname, email, password });
      setUser('');
      setName('');
      setEmail('');
      setPassword('');
      setconfirmPassword('');
      setOpen(false);
      await refreshUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={onSubmit}>
        {update ? <h4>Update User</h4> : <h4>Create New User</h4>}
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={e => setUser(e.currentTarget.value)} />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={fullname} onChange={e => setName(e.currentTarget.value)} />
        </div>
        {update ? (
          <div>
            <button type="button" onClick={updatedata}>Update Data</button>
            <button type="button" onClick={passwordreset}>Send Password Reset</button>
            <button type="button" onClick={deleteUser}>Deactivate User</button>
          </div>
        ) : (
          <div>
            <div>
              <label>E-mail:</label>
              <input type="text" value={email} onChange={e => setEmail(e.currentTarget.value)} />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)} />
            </div>
            <div>
              <label>Confirm Password:</label>
              <input type="password" value={confirmpassword} onChange={e => setconfirmPassword(e.currentTarget.value)} />
            </div>
            <button>Create New User</button>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <List className={classes.root}>
          <ButtonGroup aria-label="outlined primary button group">
            <Button color="primary" onClick={handleOpen}>NEW</Button>
          </ButtonGroup>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
          {users.map((u) => (
            <ListItem alignItems="flex-start" key={u.id} onClick={selectItem.bind(this, u)}>
              <ListItemAvatar>
                <Avatar alt={u.fullname} src={u.picture} />
              </ListItemAvatar>
              <ListItemText
                primary={u.fullname}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {u.email}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
          <Divider variant="inset" component="li" />
        </List>
      </Grid>
    </Grid>
  );
}
