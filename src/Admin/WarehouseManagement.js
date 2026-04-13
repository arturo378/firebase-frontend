import React, { useRef } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";
import api from '../config/api';

function WarehouseManagement(){
  const tableRef = useRef();

  const fetchData = (query) => {
    const page = query.page + 1;
    const limit = query.pageSize;
    return api.get(`/api/warehouses?page=${page}&limit=${limit}`)
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

  const additem = async (incoming, resolve) => {
    let errorList = [];
    if (!incoming.name) errorList.push("Please enter name");
    if (!incoming.warehousenumber) errorList.push("Please enter warehouse number");
    if (!incoming.areamanager) errorList.push("Please enter area manager");
    if (errorList.length > 0) { resolve(); return; }

    try {
      await api.post('/api/warehouses', {
        warehousenumber: incoming.warehousenumber,
        name: incoming.name,
        areamanager: incoming.areamanager,
      });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const updateitem = async (oldincoming, incoming, resolve) => {
    try {
      await api.put(`/api/warehouses/${oldincoming.id}`, {
        warehousenumber: incoming.warehousenumber,
        name: incoming.name,
        areamanager: incoming.areamanager,
      });
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/warehouses/${incoming.id}`);
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const history = useHistory();
  function goToInventory(data, rowdata) {
    history.push({ pathname: '/warehousechemical', state: rowdata });
  }

  const columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Warehouse Number", field: "warehousenumber" },
    { title: "Name", field: "name" },
    { title: "Area Manager", field: "areamanager" },
  ];

  return (
    <MaterialTable
      tableRef={tableRef}
      title="Warehouses"
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
      actions={[
        {
          icon: 'science',
          tooltip: 'Manage Inventory',
          onClick: (event, rowData) => goToInventory(event, rowData),
        },
      ]}
    />
  );
}

export default WarehouseManagement;
