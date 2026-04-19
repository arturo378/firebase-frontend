import React, { useState, useEffect, useRef } from 'react';
import MaterialTable, { MTableToolbar } from '../config/MaterialTable';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { Select, MenuItem } from "@material-ui/core";
import PageTitle from '../components/PageTitle';
import api from '../config/api';

function Pricing() {
  const location = useLocation();
  const [chemicals, setChemicals] = useState([]);
  const companyid = location.state.id;
  const tableRef = useRef();

  const fetchData = (query) => {
    const page = query.page + 1;
    const limit = query.pageSize;
    return api.get(`/api/pricing?company=${companyid}&page=${page}&limit=${limit}`)
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

  useEffect(() => {
    api.get('/api/chemicals?limit=100').then(res => setChemicals(res.data)).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyid]);

  const additem = async (incoming, resolve) => {
    if (!incoming.chemical || !incoming.price) { resolve(); return; }
    try {
      await api.post('/api/pricing', {
        chemical: incoming.chemical,
        price: incoming.price,
        company: companyid,
      });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    try {
      await api.put(`/api/pricing/${oldincoming.id}`, {
        chemical: incoming.chemical,
        price: incoming.price,
        company: companyid,
      });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/pricing/${incoming.id}`);
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const history = useHistory();
  function back() {
    history.push("/locationmanagment/");
  }

  const columns = [
    { title: "id", field: "id", hidden: true },
    {
      title: "Chemical",
      field: "chemical",
      render: rowData => rowData.chemical?.tradename || '',
      editComponent: ({ value, onRowDataChange, rowData }) => (
        <Select
          value={typeof value === 'object' ? value?.id || '' : value || ''}
          onChange={(event) => {
            onRowDataChange({ ...rowData, chemical: event.target.value });
          }}
        >
          {chemicals.map((chem) => (
            <MenuItem key={chem.id} value={chem.id}>
              {chem.tradename}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    { title: "Price", field: "price" },
  ];

  return (
    <div>
      <PageTitle>Pricing</PageTitle>
      <MaterialTable
        tableRef={tableRef}
        columns={columns}
      data={fetchData}
      options={{
        pageSize: 10,
        pageSizeOptions: [5, 10, 20],
        search: false,
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
    </div>
  );
}

export default Pricing;
