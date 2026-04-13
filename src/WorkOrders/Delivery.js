import React, { useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";
import { Select, MenuItem } from "@material-ui/core";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import api, { getCurrentUser } from '../config/api';

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
  const [companies, setCompanies] = useState([]);
  const [leases, setLeases] = useState([]);
  const [wells, setWells] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const GoogleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [position, setPosition] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedLeaseId, setSelectedLeaseId] = useState('');
  const tableRef = useRef();

  const handleDateChange = (date) => setSelectedDate(date);
  const handleClose = () => setOpen(false);

  const mapStyles = { height: "400px", width: "100%" };
  const onLoad = marker => console.log('marker: ', marker);

  const fetchData = (query) => {
    const page = query.page + 1;
    const limit = query.pageSize;
    return api.get(`/api/deliveries?page=${page}&limit=${limit}`)
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

  const refreshTable = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  useEffect(() => {
    Promise.all([
      api.get('/api/companies?limit=100'),
      api.get('/api/leases?limit=100'),
      api.get('/api/wells?limit=100'),
    ]).then(([c, l, w]) => {
      setCompanies(c.data);
      setLeases(l.data);
      setWells(w.data);
    }).catch(console.error);
  }, []);

  const getIdFromField = (val) => (val && typeof val === 'object') ? val.id : val;

  const additem = async (incoming, resolve) => {
    const companyId = getIdFromField(incoming.company);
    const leaseId = getIdFromField(incoming.lease);
    const wellId = getIdFromField(incoming.well);
    if (!companyId || !leaseId || !wellId) { resolve(); return; }
    const currentUser = getCurrentUser();
    try {
      await api.post('/api/deliveries', {
        company: companyId,
        lease: leaseId,
        well: wellId,
        date: selectedDate,
        gps: incoming.gps,
        comments: incoming.comments,
        createdBy: currentUser?.id,
        invoicenum: incoming.invoicenum,
        active: 0,
      });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    const companyId = getIdFromField(incoming.company);
    const leaseId = getIdFromField(incoming.lease);
    const wellId = getIdFromField(incoming.well);
    try {
      await api.put(`/api/deliveries/${oldincoming.id}`, {
        company: companyId,
        lease: leaseId,
        well: wellId,
        date: selectedDate,
        gps: incoming.gps,
        comments: incoming.comments,
        invoicenum: incoming.invoicenum,
        active: incoming.active,
      });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/deliveries/${incoming.id}`);
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const openmap = (event, rowData) => {
    if (!rowData.gps) return;
    const gpsdat = rowData.gps.split(',');
    setPosition({ lat: parseFloat(gpsdat[0]), lng: parseFloat(gpsdat[1]) });
    setOpen(true);
  };

  const history = useHistory();
  function goToChemicals(event, rowData) {
    history.push({ pathname: '/delivery/editdelivery', state: rowData });
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {GoogleMapsKey ? (
        <LoadScript id="Deliveries" googleMapsApiKey={GoogleMapsKey}>
          <GoogleMap
            id="marker-example"
            mapContainerStyle={mapStyles}
            zoom={13}
            center={position}
          >
            <Marker onLoad={onLoad} position={position} />
          </GoogleMap>
        </LoadScript>
      ) : (
        <div style={{ ...mapStyles, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0' }}>
          <span>Map unavailable – no API key configured</span>
        </div>
      )}
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
      <MaterialTable
        tableRef={tableRef}
        onRowClick={openmap}
        title="Delivery"
        columns={columns}
        data={fetchData}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          search: false,
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) => new Promise((resolve) => additem(newData, resolve)),
          onRowUpdate: (newData, oldData) => new Promise((resolve) => updateitem(oldData, newData, resolve)),
          onRowDelete: (oldData) => new Promise((resolve) => removeitem(oldData, resolve)),
        }}
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
