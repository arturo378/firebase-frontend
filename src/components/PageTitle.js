import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: '#0f172a',
  },
}));

export default function PageTitle({ children }) {
  const classes = useStyles();
  return (
    <Typography variant="h4" component="h1" className={classes.title}>
      {children}
    </Typography>
  );
}

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
};
