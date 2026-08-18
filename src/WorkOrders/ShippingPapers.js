import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { useAuth } from '../config/AuthContext';
import { selectCurrentUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import {
  useGetShippingPapersQuery,
  useAddShippingPaperMutation,
  useUpdateShippingPaperMutation,
  useDeleteShippingPaperMutation,
} from '../store/api/shippingPapersApi';

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
  const { isAdmin } = useAuth();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(selectCurrentUser);

  const { data, isFetching } = useGetShippingPapersQuery({ limit: 1000 });
  const [addShippingPaper] = useAddShippingPaperMutation();
  const [updateShippingPaper] = useUpdateShippingPaperMutation();
  const [deleteShippingPaper] = useDeleteShippingPaperMutation();

  const rows = data?.data ?? [];

  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => setSelectedDate(date);
  const handleClose = () => setOpen(false);

  const mapStyles = { height: "400px", width: "100%" };

  const additem = async (incoming) => {
    if (!incoming.originwarehousenumber || !incoming.destinationwarehousenumber || !incoming.trucknumber || !incoming.gps) {
      dispatch(showToast({ severity: 'warning', message: 'Fill in origin, destination, truck number, and GPS' }));
      return;
    }
    try {
      await addShippingPaper({
        date: selectedDate,
        createdBy: currentUser?.id,
        originwarehousenumber: incoming.originwarehousenumber,
        destinationwarehousenumber: incoming.destinationwarehousenumber,
        trucknumber: incoming.trucknumber,
        comments: incoming.comments,
        gps: incoming.gps,
        active: 1,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Shipping paper added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add shipping paper' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    try {
      await updateShippingPaper({
        id: oldData.id,
        date: selectedDate,
        originwarehousenumber: incoming.originwarehousenumber,
        destinationwarehousenumber: incoming.destinationwarehousenumber,
        trucknumber: incoming.trucknumber,
        comments: incoming.comments,
        gps: incoming.gps,
        active: incoming.active,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Shipping paper updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update shipping paper' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteShippingPaper(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Shipping paper deleted' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to delete shipping paper' }));
    }
  };

  const openmap = (event, rowData) => {
    const p = parseGps(rowData.gps);
    if (!p) return;
    setPosition(p);
    setOpen(true);
  };

  const goToChemicals = (event, rowData) => {
    history.push({ pathname: '/shippingchemicals', state: rowData });
  };

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
        onRowClick={openmap}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          search: false,
          actionsColumnIndex: -1,
        }}
        editable={isAdmin ? {
          onRowAdd: (newData) => additem(newData),
          onRowUpdate: (newData, oldData) => updateitem(oldData, newData),
          onRowDelete: (oldData) => removeitem(oldData),
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
