import React, { useState, useEffect } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { Select, MenuItem } from "@material-ui/core";
import api from '../config/api';

function Pricing() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [chemicals, setChemicals] = useState([]);
  const companyid = location.state.id;

  const refreshData = async () => {
    const result = await api.get(`/api/pricing?company=${companyid}`);
    setData(result);
  };

  useEffect(() => {
    refreshData();
    api.get('/api/chemicals').then(setChemicals).catch(console.error);
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
      await refreshData();
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
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/pricing/${incoming.id}`);
      await refreshData();
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
    <MaterialTable
      title="Pricing"
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

export default Pricing;
