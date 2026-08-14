import React, { useState, useRef } from 'react';
import MaterialTable from '../config/MaterialTable';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import MapView, { parseGps } from '../config/MapView';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';
import PageTitle from '../components/PageTitle';
import api, { getCurrentUser } from '../config/api';
import { useAuth } from '../config/AuthContext';

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ShippingPaper() {
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [position, setPosition] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tableRef = useRef();
  const { isAdmin } = useAuth();

  const handleDateChange = (date) => setSelectedDate(date);
  const handleClose = () => setOpen(false);

  const mapStyles = { height: "400px", width: "100%" };

  const fetchData = (query) => {
    const page = query.page + 1;
    const limit = query.pageSize;
    return api.get(`/api/shipping-papers?page=${page}&limit=${limit}`)
      .then((result) => ({
        data: result.data,
        page: query.page,
        totalCount: result.totalItems,
      }))
      .catch((err) => {
        console.error(err);
        return { data: [], page: 0, totalCount: 0 };
      });
  };

  const additem = async (incoming, resolve) => {
    if (!incoming.originwarehousenumber || !incoming.destinationwarehousenumber || !incoming.trucknumber || !incoming.gps) {
      resolve(); return;
    }
    const currentUser = getCurrentUser();
    try {
      await api.post('/api/shipping-papers', {
        date: selectedDate,
        createdBy: currentUser?.id,
        originwarehousenumber: incoming.originwarehousenumber,
        destinationwarehousenumber: incoming.destinationwarehousenumber,
        trucknumber: incoming.trucknumber,
        comments: incoming.comments,
        gps: incoming.gps,
        active: 1,
      });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    try {
      await api.put(`/api/shipping-papers/${oldincoming.id}`, {
        date: selectedDate,
        originwarehousenumber: incoming.originwarehousenumber,
        destinationwarehousenumber: incoming.destinationwarehousenumber,
        trucknumber: incoming.trucknumber,
        comments: incoming.comments,
        gps: incoming.gps,
        active: incoming.active,
      });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/shipping-papers/${incoming.id}`);
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const openmap = (event, rowData) => {
    const p = parseGps(rowData.gps);
    if (!p) return;
    setPosition(p);
    setOpen(true);
  };

  const history = useHistory();
  function goToChemicals(event, rowData) {
    history.push({ pathname: '/shippingchemicals', state: rowData });
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <MapView center={position} zoom={13} markers={position ? [position] : []} style={mapStyles} />
    </div>
  );

  const columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Data Number", field: "datanumber", editable: 'never' },
    {
      title: "Date",
      field: "date",
      render: rowData => rowData.date ? moment(rowData.date).format("MM/DD/YY") : '',
      editComponent: () => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{ 'aria-label': 'change date' }}
          />
        </MuiPickersUtilsProvider>
      ),
    },
    {
      title: "Created By",
      field: "createdBy",
      editable: 'never',
      render: rowData => rowData.createdBy?.username || rowData.createdBy?.name || '',
    },
    { title: "Origin Warehouse Number", field: "originwarehousenumber" },
    { title: "Destination Number", field: "destinationwarehousenumber" },
    { title: "Truck Number", field: "trucknumber" },
    { title: "Comments", field: "comments" },
    { title: "Location", field: "gps" },
    {
      title: 'Completed',
      field: 'active',
      lookup: { 1: 'Completed', 0: 'Non-Completed' },
    },
  ];

  return (
    <div>
      <PageTitle>Shipping Papers</PageTitle>
      <MaterialTable
        tableRef={tableRef}
        onRowClick={openmap}
        columns={columns}
        data={fetchData}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          search: false,
          actionsColumnIndex: -1,
        }}
        editable={isAdmin ? {
          onRowAdd: (newData) => new Promise((resolve) => additem(newData, resolve)),
          onRowUpdate: (newData, oldData) => new Promise((resolve) => updateitem(oldData, newData, resolve)),
          onRowDelete: (oldData) => new Promise((resolve) => removeitem(oldData, resolve)),
        } : undefined}
        actions={[{
          icon: 'science',
          tooltip: 'Manage Chemicals',
          onClick: (event, rowData) => goToChemicals(event, rowData),
        }]}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

export default ShippingPaper;
