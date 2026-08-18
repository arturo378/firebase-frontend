import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from '../config/MaterialTable';
import { useHistory } from "react-router-dom";
import { Select, MenuItem } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import MapView, { parseGps } from '../config/MapView';
import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import PageTitle from '../components/PageTitle';
import { useAuth } from '../config/AuthContext';
import { selectCurrentUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import { useGetCompaniesQuery } from '../store/api/companiesApi';
import { useGetLeasesQuery } from '../store/api/leasesApi';
import { useGetWellsQuery } from '../store/api/wellsApi';
import {
  useGetDeliveriesQuery,
  useAddDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
} from '../store/api/deliveriesApi';

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

function Delivery() {
  const { isAdmin } = useAuth();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(selectCurrentUser);

  const { data: companiesData } = useGetCompaniesQuery({ limit: 100 });
  const { data: leasesData } = useGetLeasesQuery({ limit: 100 });
  const { data: wellsData } = useGetWellsQuery({ limit: 100 });
  const companies = companiesData?.data ?? [];
  const leases = leasesData?.data ?? [];
  const wells = wellsData?.data ?? [];

  const { data, isFetching } = useGetDeliveriesQuery({ limit: 1000 });
  const [addDelivery] = useAddDeliveryMutation();
  const [updateDelivery] = useUpdateDeliveryMutation();
  const [deleteDelivery] = useDeleteDeliveryMutation();

  const rows = data?.data ?? [];

  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [position, setPosition] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedLeaseId, setSelectedLeaseId] = useState('');

  const handleDateChange = (date) => setSelectedDate(date);
  const handleClose = () => setOpen(false);

  const mapStyles = { height: "400px", width: "100%" };

  const getIdFromField = (val) => (val && typeof val === 'object') ? val.id : val;

  const additem = async (incoming) => {
    const companyId = getIdFromField(incoming.company);
    const leaseId = getIdFromField(incoming.lease);
    const wellId = getIdFromField(incoming.well);
    if (!companyId || !leaseId || !wellId) {
      dispatch(showToast({ severity: 'warning', message: 'Select company, lease, and well' }));
      return;
    }
    try {
      await addDelivery({
        company: companyId,
        lease: leaseId,
        well: wellId,
        date: selectedDate,
        gps: incoming.gps,
        comments: incoming.comments,
        createdBy: currentUser?.id,
        invoicenum: incoming.invoicenum,
        active: 0,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Delivery added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add delivery' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    const companyId = getIdFromField(incoming.company);
    const leaseId = getIdFromField(incoming.lease);
    const wellId = getIdFromField(incoming.well);
    try {
      await updateDelivery({
        id: oldData.id,
        company: companyId,
        lease: leaseId,
        well: wellId,
        date: selectedDate,
        gps: incoming.gps,
        comments: incoming.comments,
        invoicenum: incoming.invoicenum,
        active: incoming.active,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Delivery updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update delivery' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteDelivery(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Delivery deleted' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to delete delivery' }));
    }
  };

  const openmap = (event, rowData) => {
    const p = parseGps(rowData.gps);
    if (!p) return;
    setPosition(p);
    setOpen(true);
  };

  const goToChemicals = (event, rowData) => {
    history.push({ pathname: '/delivery/editdelivery', state: rowData });
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
      title: "Company",
      field: "company",
      render: rowData => rowData.company?.name || '',
      editComponent: ({ value, onRowDataChange, rowData }) => (
        <Select
          value={getIdFromField(value) || ''}
          onChange={(event) => {
            setSelectedCompanyId(event.target.value);
            setSelectedLeaseId('');
            onRowDataChange({ ...rowData, company: event.target.value, lease: '', well: '' });
          }}
        >
          {companies.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </Select>
      ),
    },
    {
      title: "Lease",
      field: "lease",
      render: rowData => rowData.lease?.name || '',
      editComponent: ({ value, onRowDataChange, rowData }) => {
        const compId = getIdFromField(rowData.company) || selectedCompanyId;
        return (
          <Select
            value={getIdFromField(value) || ''}
            onChange={(event) => {
              setSelectedLeaseId(event.target.value);
              onRowDataChange({ ...rowData, lease: event.target.value, well: '' });
            }}
          >
            {leases.filter(l => getIdFromField(l.company) === compId).map((l) => (
              <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Well",
      field: "well",
      render: rowData => rowData.well?.name || '',
      editComponent: ({ value, onRowDataChange, rowData }) => {
        const leaseId = getIdFromField(rowData.lease) || selectedLeaseId;
        return (
          <Select
            value={getIdFromField(value) || ''}
            onChange={(event) => {
              onRowDataChange({ ...rowData, well: event.target.value });
            }}
          >
            {wells.filter(w => getIdFromField(w.lease) === leaseId).map((w) => (
              <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
            ))}
          </Select>
        );
      },
    },
    { title: "GPS", field: "gps" },
    { title: "Comments", field: "comments" },
    {
      title: "Created By",
      field: "createdBy",
      editable: 'never',
      render: rowData => rowData.createdBy?.username || rowData.createdBy?.name || '',
    },
    { title: "Invoice Number", field: "invoicenum" },
    {
      title: 'Completed',
      field: 'active',
      lookup: { 1: 'Completed', 0: 'Non-Completed' },
    },
  ];

  return (
    <div>
      <PageTitle>Delivery</PageTitle>
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

export default Delivery;
