import React, { useState, useEffect } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import api from '../config/api';

function WellManagement(){
  const location = useLocation();
  const [data, setData] = useState([]);
  const leaseid = location.state.leaseid;
  const companyid = location.state.companyid;

  const refreshData = async () => {
    const result = await api.get(`/api/wells?lease=${leaseid}`);
    setData(result);
  };

  useEffect(() => {
    refreshData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaseid]);

  const additem = async (incoming, resolve) => {
    if (!incoming.name) { resolve(); return; }
    try {
      await api.post('/api/wells', {
        name: incoming.name,
        gps: incoming.gps,
        description: incoming.description,
        lease: leaseid,
        company: companyid,
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    if (!incoming.name) { resolve(); return; }
    try {
      await api.put(`/api/wells/${oldincoming.id}`, {
        name: incoming.name,
        gps: incoming.gps,
        description: incoming.description,
        lease: leaseid,
        company: companyid,
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/wells/${incoming.id}`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const history = useHistory();
  function back() {
    history.push({ pathname: '/locationmanagment/leasemanagment', state: { id: companyid } });
  }

  const columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Name", field: "name" },
    { title: "GPS Coordinates", field: "gps" },
    { title: "Description", field: "description" },
  ];

  return (
    <MaterialTable
      title="Well Management"
      columns={columns}
      data={data}
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <div style={{ padding: '0px 10px' }}>
              <Button variant="contained" onClick={back}>Back</Button>
            </div>
          </div>
        ),
      }}
      editable={{
        onRowAdd: (newData) => new Promise((resolve) => additem(newData, resolve)),
        onRowUpdate: (newData, oldData) => new Promise((resolve) => updateitem(oldData, newData, resolve)),
        onRowDelete: (oldData) => new Promise((resolve) => removeitem(oldData, resolve)),
      }}
    />
  );
}

export default WellManagement;
