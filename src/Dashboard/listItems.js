import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import HomeIcon from '@material-ui/icons/LocationOn';
import ReceiptIcon from '@material-ui/icons/Receipt';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <Button component={Link} to="/" color="primary">
      Dashboard
    </Button>
    </ListItem>
    <ListSubheader inset>Admin</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <Button component={Link} to="/usermanagement" color="primary">
      User Management
    </Button>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LocationOnIcon />
      </ListItemIcon>
      <Button component={Link} to="/locationmanagment" color="primary">
      Manage Location
    </Button>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <Button component={Link} to="/warehousemanagement" color="primary">
      Manage Warehouse
    </Button>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <Button component={Link} to="/chemicalmanagement" color="primary">
      Manage Products
    </Button>
    </ListItem>
    
    <ListSubheader inset>Work Orders</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <ReceiptIcon />
      </ListItemIcon>
      <Button component={Link} to="/shippingpapers" color="primary">
      Shipping Papers
    </Button>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LocalShippingIcon />
      </ListItemIcon>
      <Button component={Link} to="/delivery/editdelivery" color="primary">
      Delivery
    </Button>
    </ListItem>
    
  </div>
);



