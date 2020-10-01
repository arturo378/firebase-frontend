import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'; 
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems} from './Dashboard/listItems.js';
import Button from '@material-ui/core/Button';
import fire from './config/fire.js';
import { BrowserRouter as Router, Switch as Switcher, Route } from 'react-router-dom';
import {Container} from "@material-ui/core";
import UserManagement from './Admin/UserManagement';
import LocationManagement from './Admin/LocationManagement.js';
import LeaseManagement from './Admin/LeaseManagement.js';
import WellManagement from './Admin/WellManagement.js';
import WarehouseManagement from './Admin/WarehouseManagement.js';
import ChemicalManagement from './Admin/ChemicalManagement.js';
import Pricing from './Admin/Pricing.js';
import ShippingPaper from './WorkOrders/ShippingPapers.js';
import ShippingChemicals from './WorkOrders/ShippingChemicals.js';
import Delivery from './WorkOrders/Delivery.js';
import EditDelivery from './WorkOrders/EditDelivery.js';
import Main from './Dashboard/Main'

function logout(){
fire.auth().signOut();
};


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Home() {


    
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Router>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
          <Button onClick={logout} variant="contained" color="secondary">
        SignOut
      </Button>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Switcher>
          <Route exact path="/">
            <Main></Main>
          </Route>
          <Route exact path="/usermanagement">
            <UserManagement></UserManagement>
          </Route>
          <Route exact path="/locationmanagment">
            <LocationManagement></LocationManagement>
          </Route>
          <Route exact path="/locationmanagment/leasemanagment">
            <LeaseManagement></LeaseManagement>
          </Route>
          <Route exact path="/locationmanagment/leasemanagment/wellmanagment">
            <WellManagement></WellManagement>
          </Route>
          <Route exact path="/warehousemanagement">
            <WarehouseManagement></WarehouseManagement>
          </Route>
          <Route exact path="/chemicalmanagement">
            <ChemicalManagement></ChemicalManagement>
          </Route>
          <Route exact path="/pricing">
            <Pricing></Pricing>
          </Route>
          <Route exact path="/shippingpapers">
            <ShippingPaper></ShippingPaper>
          </Route>
          <Route exact path="/shippingchemicals">
            <ShippingChemicals></ShippingChemicals>
          </Route>
          <Route exact path="/delivery">
            <Delivery></Delivery>
          </Route>
          <Route exact path="/delivery/editdelivery">
            <EditDelivery></EditDelivery>
          </Route>
        </Switcher>
      </main>
    </div>
    
    
    
    </Router>
  );
}


