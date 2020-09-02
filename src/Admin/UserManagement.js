import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import fire from '../config/fire';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Modal from '@material-ui/core/Modal';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';




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


function useTimes(){
  const [times, setTimes] = useState([])

  useEffect(() => {
    fire
      .firestore()
      .collection('users')
      .onSnapshot((snapshot) => {
        const newTimes = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        setTimes(newTimes)
      })
  }, [])

  return times;

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
  '& .MuiTextField-root': {
    margin: theme.spacing(1),
    width: 200,
  },
  
  
}));



export default function UserManagement() {
    const times = useTimes();
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [username, setUser] = useState('')
    const [fullname, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setconfirmPassword] = useState('')
    const [permissions, setPermissions] = useState('')
    const [UID, setUID] = useState('')
    const [deleteID, setdelID] = useState('')
    const [editData, seteditData] = useState([])
    
  const handleOpen = () => {
    setOpen(true); 
  };

  const handleClose = () => {
    setOpen(false);
  };

  const selectItem = (i) => {
    setdelID('');
    setdelID(i.id);
    

    //console.log(times)
    
    // editData.seteditData(times,{ id: i.id})
  //   editData.seteditData(prevState => ({
  //     times: {                   // object that we want to update
  //         ...prevState.times,    // keep all other key-value pairs
  //         id: i.id       // update the value of specific key
  //     }
  // }))
  //   console.log(editData);
 //console.log(i.id);
    
  };
  
  const deleteUser = () => {

    
  };



  function onSubmit(e) {
    // const { password, confirmpassword } = this.state;
    
    
    // // perform all neccassary validations
    // if (password !== confirmPassword) {
    //     alert("Passwords don't match");
    // } else {
    //     // make API call
    // }

    e.preventDefault();
    fire.auth().createUserWithEmailAndPassword(email,confirmpassword).then((u)=>{
      console.log(u.user.uid)

      fire
    .firestore()
    .collection('users')
    .add({
      username,
      fullname,
      UID: u.user.uid,
      email,
      permissions,
      status: '1'
    })
    .then(() => {
      setUser('')
      setName('')
      setEmail('')
      setPassword('')
      setPermissions('')
      setUID('');
    })
    handleClose();
      //setUID(u.user.uid)
        //console.log(u)
    }).catch((err)=>{
        console.log(err);
    })
    
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={onSubmit}>
        <h4>Create New User</h4>
        <div>
            <label>Username:</label>
            <input type="text" value = {username} onChange={e => setUser(e.currentTarget.value)}></input>
        </div>
        <div>
            <label>Name:</label>
            <input type="text" value = {fullname} onChange={e => setName(e.currentTarget.value)}></input>
        </div>
        <div>
            <label>E-mail:</label>
            <input type="text" value = {email} onChange={e => setEmail(e.currentTarget.value)}></input>
        </div>
        <div>
            <label>Password:</label>
            <input type="password" value = {password} onChange={e => setPassword(e.currentTarget.value)}></input>
        </div>
        <div>
            <label>Confirm Password:</label>
            <input type="password" value = {confirmpassword} onChange={e => setconfirmPassword(e.currentTarget.value)}></input>
        </div>
        <div>
            <label>Permissions:</label>
            <input type="text" value = {permissions} onChange={e => setPermissions(e.currentTarget.value)}></input>
        </div>
        <button >Submit</button>
      </form>
      
    </div>
  );

 

  return (
    
    <Grid container spacing={3}>
        <Grid item xs>
        <List className={classes.root}>
      <ButtonGroup  aria-label="outlined primary button group">
    <Button color="primary" onClick={handleOpen}>NEW</Button>
    <Button color= "secondary" onClick={deleteUser}>DELETE</Button>
    </ButtonGroup>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      {times.map((time) => 
      
        <ListItem alignItems="flex-start" onClick={selectItem.bind(this, time)}>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={time.picture} />
        </ListItemAvatar>
        <ListItemText
          primary={time.fullname}
          
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {time.email}
              </Typography>
              
            </React.Fragment>
          }
        />
      </ListItem>
      )}
      <Divider variant="inset" component="li" />
    </List>
        </Grid>
       
        <Grid item xs>
        {editData.map((time) => 
        <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField label="Username" id="standard-size-small" defaultValue="Small" size="small" />
      </div>
      <div>
        <TextField label="Name:" id="standard-size-small" defaultValue="Small" size="small" />
      </div>
      <div>
        <TextField label="E-mail" id="standard-size-small" defaultValue="Small" size="small" />
      </div>
      <div>
        <TextField label="Password" id="standard-size-small" defaultValue="Small" size="small" />
      </div>
      <div>
        <TextField label="Confirm Password" id="standard-size-small" defaultValue="Small" size="small" />
      </div>
      <div>
        <TextField label="Permissions" id="standard-size-small" defaultValue="Small" size="small" />
      </div>
      <div>
      <Button color="primary" onClick={handleOpen}>Save</Button>
    <Button color= "secondary" onClick={deleteUser}>DELETE</Button>
      </div>
     
     
    </form>
    )}
        </Grid>
      </Grid>

    
  );


  
}

