import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";
import api from '../config/api';

function LocationManagement(){
  const [data, setData] = useState([]);

  const refreshData = async () => {
    const result = await api.get('/api/companies');
    setData(result);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const additem = async (incoming, resolve) => {
    let errorList = [];
    if (!incoming.name) errorList.push("Please enter company name");
    if (!incoming.city) errorList.push("Please enter city");
    if (!incoming.state) errorList.push("Please enter state");
    if (errorList.length > 0) { resolve(); return; }

    try {
      await api.post('/api/companies', {
        name: incoming.name,
        city: incoming.city,
        state: incoming.state,
        zip: incoming.zip,
        phone: incoming.phone,
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    let errorList = [];
    if (!incoming.name) errorList.push("Please enter company name");
    if (!incoming.city) errorList.push("Please enter city");
    if (!incoming.state) errorList.push("Please enter state");
    if (errorList.length > 0) { resolve(); return; }

    try {
      await api.put(`/api/companies/${oldincoming.id}`, {
        name: incoming.name,
        city: incoming.city,
        state: incoming.state,
        zip: incoming.zip,
        phone: incoming.phone,
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/companies/${incoming.id}`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const history = useHistory();
  function goToLeases(data, rowdata) {
    history.push({ pathname: '/locationmanagment/leasemanagment', state: rowdata });
  }
  function goToPricing(data, rowdata) {
    history.push({ pathname: '/pricing', state: rowdata });
  }

  const columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Name", field: "name" },
    { title: "City", field: "city" },
    { title: "State", field: "state" },
    { title: "Zip Code", field: "zip" },
    { title: "Phone Number", field: "phone" },
  ];

  return (
    <MaterialTable
      title="Company Management"
      columns={columns}
      data={data}
      editable={{
        onRowAdd: (newData) => new Promise((resolve) => additem(newData, resolve)),
        onRowUpdate: (newData, oldData) => new Promise((resolve) => updateitem(oldData, newData, resolve)),
        onRowDelete: (oldData) => new Promise((resolve) => removeitem(oldData, resolve)),
      }}
      actions={[
        {
          icon: 'sort',
          tooltip: 'Manage Leases',
          onClick: (event, rowData) => goToLeases(event, rowData),
        },
        {
          icon: 'attach_money',
          tooltip: 'Pricing',
          onClick: (event, rowData) => goToPricing(event, rowData),
        },
      ]}
    />
  );
}

export default LocationManagement;
