import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import api from '../config/api';

function ChemicalManagement(){
  const [data, setData] = useState([]);

  const refreshData = async () => {
    const result = await api.get('/api/chemicals');
    setData(result);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const additem = async (incoming, resolve) => {
    let errorList = [];
    if (!incoming.tradename) errorList.push("Please enter trade name");
    if (!incoming.dottag) errorList.push("Please enter DOT tag");
    if (!incoming.weight) errorList.push("Please enter weight");
    if (errorList.length > 0) { resolve(); return; }

    try {
      await api.post('/api/chemicals', {
        tradename: incoming.tradename,
        dottag: incoming.dottag,
        weight: incoming.weight,
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    try {
      await api.put(`/api/chemicals/${oldincoming.id}`, {
        tradename: incoming.tradename,
        dottag: incoming.dottag,
        weight: incoming.weight,
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/chemicals/${incoming.id}`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Trade Name", field: "tradename" },
    { title: "DOT Tag", field: "dottag" },
    { title: "Weight", field: "weight" },
  ];

  return (
    <MaterialTable
      title="Product Management"
      columns={columns}
      data={data}
      editable={{
        onRowAdd: (newData) => new Promise((resolve) => additem(newData, resolve)),
        onRowUpdate: (newData, oldData) => new Promise((resolve) => updateitem(oldData, newData, resolve)),
        onRowDelete: (oldData) => new Promise((resolve) => removeitem(oldData, resolve)),
      }}
    />
  );
}

export default ChemicalManagement;
