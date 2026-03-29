import React, { useState, useEffect } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import { Select, MenuItem } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import api from '../config/api';

function DeliveryEdit() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [chemicals, setChemicals] = useState([]);
  const deliveryid = location.state.id;

  const refreshData = async () => {
    const result = await api.get(`/api/delivery-chemicals?delivery=${deliveryid}`);
    setData(result);
  };

  useEffect(() => {
    refreshData();
    api.get('/api/chemicals').then(setChemicals).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryid]);

  const additem = async (incoming, resolve) => {
    if (!incoming.chemical) { resolve(); return; }
    try {
      await api.post('/api/delivery-chemicals', {
        chemical: incoming.chemical,
        quantity: incoming.quantity,
        delivery: deliveryid,
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    try {
      await api.put(`/api/delivery-chemicals/${oldincoming.id}`, {
        chemical: incoming.chemical,
        quantity: incoming.quantity,
        delivery: deliveryid,
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/delivery-chemicals/${incoming.id}`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const history = useHistory();
  function back() {
    history.push({ pathname: '/delivery' });
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
    { title: "Quantity", field: "quantity" },
  ];

  return (
    <MaterialTable
      title="Delivery: Chemicals"
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

export default DeliveryEdit;
