import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import RoomIcon from '@material-ui/icons/Room';
import BusinessIcon from '@material-ui/icons/Business';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import StorageIcon from '@material-ui/icons/Storage';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  section: {
    marginBottom: 4,
  },
  sectionHeader: {
    lineHeight: '20px',
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#64748b',
    backgroundColor: 'transparent',
    padding: '14px 24px 6px',
  },
  navItem: {
    position: 'relative',
    borderRadius: 10,
    margin: '3px 12px',
    minHeight: 42,
    padding: '0 12px',
    color: '#cbd5e1',
    transition: 'background-color 200ms ease, color 200ms ease, transform 200ms ease',
    '&:hover': {
      backgroundColor: 'rgba(148, 163, 184, 0.10)',
      color: '#f8fafc',
      transform: 'translateX(2px)',
    },
  },
  navItemSelected: {
    background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%) !important',
    color: '#ffffff !important',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
    '&:hover': {
      background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%) !important',
      transform: 'translateX(2px)',
    },
  },
  navIcon: {
    color: '#94a3b8',
    minWidth: 36,
    transition: 'color 200ms ease',
  },
  navIconSelected: {
    color: '#ffffff',
  },
  navLabel: {
    fontSize: 13.5,
    fontWeight: 500,
    letterSpacing: 0.1,
    color: 'inherit',
    transition: 'font-weight 200ms ease',
  },
  navLabelSelected: {
    color: '#ffffff',
    fontWeight: 600,
  },
}));

const menuSections = [
  {
    header: null,
    items: [
      { label: 'Dashboard', to: '/', icon: DashboardIcon },
    ],
  },
  {
    header: 'Admin',
    items: [
      { label: 'User Management', to: '/usermanagement', icon: PeopleIcon },
      { label: 'Manage Location', to: '/locationmanagment', icon: RoomIcon },
      { label: 'Manage Warehouse', to: '/warehousemanagement', icon: BusinessIcon },
      { label: 'Manage Products', to: '/chemicalmanagement', icon: LocalOfferIcon },
    ],
  },
  {
    header: 'Work Orders',
    items: [
      { label: 'Shipping Papers', to: '/shippingpapers', icon: DescriptionIcon },
      { label: 'Delivery', to: '/delivery', icon: LocalShippingIcon },
    ],
  },
  {
    header: 'Reports',
    items: [
      { label: 'Earnings Report', to: '/weeklyearnings', icon: ShowChartIcon },
      { label: 'User Report', to: '/userReport', icon: AssignmentIndIcon },
      { label: 'Inventory Levels', to: '/warehouseInventory', icon: StorageIcon },
    ],
  },
];

function SidebarItem({ item, isCollapsed, isSelected }) {
  const classes = useStyles();
  const Icon = item.icon;
  const itemContent = (
    <ListItem
      button
      component={Link}
      to={item.to}
      selected={isSelected}
      className={[classes.navItem, isSelected ? classes.navItemSelected : ''].join(' ')}
      style={{
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        paddingLeft: isCollapsed ? 0 : 14,
        paddingRight: isCollapsed ? 0 : 14,
      }}
    >
      <ListItemIcon
        className={[classes.navIcon, isSelected ? classes.navIconSelected : ''].join(' ')}
        style={{
          minWidth: isCollapsed ? 0 : 36,
          justifyContent: 'center',
        }}
      >
        <Icon fontSize="small" />
      </ListItemIcon>
      {!isCollapsed && (
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            className: [classes.navLabel, isSelected ? classes.navLabelSelected : ''].join(' '),
          }}
        />
      )}
    </ListItem>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={item.label} placement="right" arrow>
        {itemContent}
      </Tooltip>
    );
  }

  return itemContent;
}

export function MainListItems({ isCollapsed }) {
  const location = useLocation();
  const classes = useStyles();

  return (
    <div>
      {menuSections.map((section) => (
        <div key={section.header || 'main'} className={classes.section}>
          {!isCollapsed && section.header && (
            <ListSubheader disableSticky className={classes.sectionHeader}>
              {section.header}
            </ListSubheader>
          )}

          {section.items.map((item) => {
            const isSelected = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);

            return (
              <SidebarItem
                key={item.to}
                item={item}
                isCollapsed={isCollapsed}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}



