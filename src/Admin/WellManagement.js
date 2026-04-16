import React, { useRef } from 'react';
import MaterialTable, { MTableToolbar } from '../config/MaterialTable';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import api from '../config/api';

function WellManagement(){
  const location = useLocation();
  const leaseid = location.state.leaseid;
  const companyid = location.state.companyid;
  const tableRef = useRef();

  const fetchData = (query) => {
    const page = query.page + 1;
    const limit = query.pageSize;
    return api.get(`/api/wells?lease=${leaseid}&page=${page}&limit=${limit}`)
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
    if (!incoming.name) { resolve(); return; }
    try {
      await api.post('/api/wells', {
        name: incoming.name,
        gps: incoming.gps,
        description: incoming.description,
        lease: leaseid,
        company: companyid,
      });
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
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/wells/${incoming.id}`);
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
      tableRef={tableRef}
      title="Well Management"
      columns={columns}
      data={fetchData}
      options={{
        pageSize: 10,
        pageSizeOptions: [5, 10, 20],
        search: false,
        actionsColumnIndex: -1,
      }}
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
