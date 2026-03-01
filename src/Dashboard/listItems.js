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
  navItem: {
    position: 'relative',
    borderRadius: 10,
    margin: '2px 8px',
    minHeight: 44,
    transition: 'background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
    '&:hover': {
      backgroundColor: 'rgba(30, 64, 175, 0.08)',
      transform: 'translateX(2px)',
    },
  },
  navItemSelected: {
    backgroundColor: 'rgba(30, 64, 175, 0.14) !important',
    boxShadow: 'inset 0 0 0 1px rgba(30, 64, 175, 0.18)',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 8,
      bottom: 8,
      width: 3,
      borderRadius: 999,
      backgroundColor: '#1e40af',
    },
  },
  navIcon: {
    color: '#475569',
    transition: 'color 180ms ease',
  },
  navIconSelected: {
    color: '#1e40af',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#334155',
    transition: 'color 180ms ease, font-weight 180ms ease',
  },
  navLabelSelected: {
    color: '#0f172a',
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

  return (
    <div>
      {menuSections.map((section) => (
        <div key={section.header || 'main'}>
          {!isCollapsed && section.header && (
            <ListSubheader
              inset
              disableSticky
              style={{
                lineHeight: '28px',
                fontSize: 11,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                color: '#64748b',
                backgroundColor: 'transparent',
              }}
            >
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



