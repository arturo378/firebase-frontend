import React, { useRef } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import api from '../config/api';

function LeaseManagement(){
  const location = useLocation();
  const companyid = location.state.id;
  const tableRef = useRef();

  const fetchData = (query) => {
    const page = query.page + 1;
    const limit = query.pageSize;
    return api.get(`/api/leases?company=${companyid}&page=${page}&limit=${limit}`)
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
      await api.post('/api/leases', { name: incoming.name, company: companyid });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    if (!incoming.name) { resolve(); return; }
    try {
      await api.put(`/api/leases/${oldincoming.id}`, { name: incoming.name, company: companyid });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/leases/${incoming.id}`);
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const history = useHistory();
  function goToWells(data, rowdata) {
    const leaseid = rowdata.id;
    history.push({ pathname: '/locationmanagment/leasemanagment/wellmanagment', state: { leaseid, companyid } });
  }
  function back() {
    history.push("/locationmanagment/");
  }

  const columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Name", field: "name" },
  ];

  return (
    <MaterialTable
      tableRef={tableRef}
      title="Lease Management"
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
      actions={[
        {
          icon: 'sort',
          tooltip: 'Manage Wells',
          onClick: (event, rowData) => goToWells(event, rowData),
        },
      ]}
    />
  );
}

export default LeaseManagement;
