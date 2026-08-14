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
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems } from './Dashboard/listItems.js';
import Button from '@material-ui/core/Button';
import api from './config/api.js';
import { BrowserRouter as Router, Switch as Switcher, Route, useLocation } from 'react-router-dom';
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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LogoMark from './components/LogoMark';
import AdminRoute from './components/AdminRoute';

const PAGE_TITLES = [
  { match: (p) => p === '/', label: 'Dashboard' },
  { match: (p) => p.startsWith('/usermanagement'), label: 'User Management' },
  { match: (p) => p.startsWith('/locationmanagment/leasemanagment/wellmanagment'), label: 'Well Management' },
  { match: (p) => p.startsWith('/locationmanagment/leasemanagment'), label: 'Lease Management' },
  { match: (p) => p.startsWith('/locationmanagment'), label: 'Location Management' },
  { match: (p) => p.startsWith('/warehousemanagement'), label: 'Warehouse Management' },
  { match: (p) => p.startsWith('/warehousechemical'), label: 'Warehouse Chemicals' },
  { match: (p) => p.startsWith('/chemicalmanagement'), label: 'Product Management' },
  { match: (p) => p.startsWith('/pricing'), label: 'Pricing' },
  { match: (p) => p.startsWith('/shippingpapers'), label: 'Shipping Papers' },
  { match: (p) => p.startsWith('/shippingchemicals'), label: 'Shipping Chemicals' },
  { match: (p) => p.startsWith('/delivery/editdelivery'), label: 'Edit Delivery' },
  { match: (p) => p.startsWith('/delivery'), label: 'Delivery' },
  { match: (p) => p.startsWith('/weeklyearnings'), label: 'Earnings Report' },
  { match: (p) => p.startsWith('/warehouseInventory'), label: 'Inventory Levels' },
  { match: (p) => p.startsWith('/userReport'), label: 'User Report' },
];

function PageTitle({ className }) {
  const { pathname } = useLocation();
  const entry = PAGE_TITLES.find((t) => t.match(pathname));
  return (
    <Typography component="h1" variant="h6" color="inherit" noWrap className={className}>
      {entry ? entry.label : 'Chemical Management System'}
    </Typography>
  );
}

async function logout() {
  try {
    await api.post('/api/auth/logout');
  } catch (e) {}
  localStorage.removeItem('accessToken');
  localStorage.removeItem('currentUser');
  window.location.reload();
}


const drawerWidth = 260;

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
    justifyContent: 'space-between',
    padding: '0 12px 0 16px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
    ...theme.mixins.toolbar,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  drawerToggle: {
    color: '#94a3b8',
    padding: 6,
    '&:hover': {
      color: '#f8fafc',
      backgroundColor: 'rgba(148, 163, 184, 0.12)',
    },
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
    border: 'none',
    overflowX: 'hidden',
    background: 'linear-gradient(180deg, #0b1220 0%, #0f172a 55%, #111827 100%)',
    color: '#e2e8f0',
    boxSizing: 'border-box',
    boxShadow: '4px 0 24px rgba(2, 6, 23, 0.25)',
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
          <PageTitle className={classes.title} />
          <Button onClick={logout} variant="contained" color="secondary" className={classes.signOutButton}>
            SignOut
          </Button>
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
        <div className={classes.toolbarIcon} style={{ justifyContent: open ? 'space-between' : 'center' }}>
          {open && (
            <div className={classes.brand}>
              <LogoMark size={38} glow />
            </div>
          )}
          <IconButton onClick={handleDrawerClose} className={classes.drawerToggle}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </div>
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
          <AdminRoute exact path="/usermanagement">
            <UserManagement></UserManagement>
          </AdminRoute>
          <AdminRoute exact path="/locationmanagment">
            <LocationManagement></LocationManagement>
          </AdminRoute>
          <AdminRoute exact path="/locationmanagment/leasemanagment">
            <LeaseManagement></LeaseManagement>
          </AdminRoute>
          <AdminRoute exact path="/locationmanagment/leasemanagment/wellmanagment">
            <WellManagement></WellManagement>
          </AdminRoute>
          <AdminRoute exact path="/warehousemanagement">
            <WarehouseManagement></WarehouseManagement>
          </AdminRoute>
          <AdminRoute exact path="/chemicalmanagement">
            <ChemicalManagement></ChemicalManagement>
          </AdminRoute>
          <AdminRoute exact path="/pricing">
            <Pricing></Pricing>
          </AdminRoute>
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
          <AdminRoute exact path="/warehousechemical">
            <WarehouseChemical></WarehouseChemical>
          </AdminRoute>
          <Route exact path="/userReport">
            <UserReport></UserReport>
          </Route>
        </Switcher>
      </main>
    </div>
    </Router>
  );
}
