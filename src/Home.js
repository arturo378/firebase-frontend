import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
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
import { MainListItems } from './Dashboard/listItems.js';
import Button from '@material-ui/core/Button';
// import fire from './config/fire.js';
import { BrowserRouter as Router, Switch as Switcher, Route } from 'react-router-dom';
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
import WeeklyEarnings from './Reports/WeeklyEarnings.js';
import WarehouseInventory from './Reports/WarehouseInventory.js';
import WarehouseChemical from './Admin/WarehouseChemical.js';
import UserReport from './Reports/UserReport.js';
import { APP_TITLE } from './config/appInfo';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const DEMO_MODE = localStorage.getItem('demoMode') === 'true';

function logout() {
  if (DEMO_MODE) {
    localStorage.removeItem('demoMode');
  }
  fire.auth().signOut();
};


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
  },
  toolbar: {
    paddingRight: 16,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 24,
    },
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
    background: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
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
    marginRight: 12,
    [theme.breakpoints.up('sm')]: {
      marginRight: 24,
    },
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    fontWeight: 600,
    letterSpacing: 0.2,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    borderRight: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
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
    width: theme.spacing(8),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  drawerList: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1.5),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#f8fafc',
  },
  signOutButton: {
    borderRadius: 10,
    textTransform: 'none',
    fontWeight: 600,
    paddingLeft: theme.spacing(1.75),
    paddingRight: theme.spacing(1.75),
    minWidth: 96,
  },
}));

export default function Home() {


    
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(!isSmallScreen);

  React.useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, !isSmallScreen && open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, !isSmallScreen && open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {APP_TITLE}
            {DEMO_MODE && (
              <span style={{
                marginLeft: 10,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: 'rgba(234,179,8,0.25)',
                color: '#fde68a',
                border: '1px solid rgba(234,179,8,0.4)',
                verticalAlign: 'middle',
              }}>
                DEMO
              </span>
            )}
          </Typography>
          <IconButton color="inherit">
          <Button onClick={logout} variant="contained" color="secondary" className={classes.signOutButton}>
        SignOut
      </Button>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
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
        <List className={classes.drawerList}>
          <MainListItems isCollapsed={!isSmallScreen && !open} />
        </List>
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
          <Route exact path="/weeklyearnings">
            <WeeklyEarnings></WeeklyEarnings>
          </Route>
          <Route exact path="/warehouseInventory">
            <WarehouseInventory></WarehouseInventory>
          </Route>
          <Route exact path="/warehousechemical">
            <WarehouseChemical></WarehouseChemical>
          </Route>
          <Route exact path="/userReport">
            <UserReport></UserReport>
          </Route>
        </Switcher>
      </main>
    </div>
    
    
    
    </Router>
  );
}


