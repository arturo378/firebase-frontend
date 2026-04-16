import React, { useRef } from 'react';
import MaterialTable from 'material-table';
import api from '../config/api';

function ChemicalManagement(){
  const tableRef = useRef();

  const fetchData = (query) => {
    const page = query.page + 1;
    const limit = query.pageSize;
    return api.get(`/api/chemicals?page=${page}&limit=${limit}`)
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
    } catch (err) {
      console.error(err);
    }
    resolve();
  };

  const removeitem = async (incoming, resolve) => {
    try {
      await api.delete(`/api/chemicals/${incoming.id}`);
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
      tableRef={tableRef}
      title="Product Management"
      columns={columns}
      data={fetchData}
      options={{
        pageSize: 10,
        pageSizeOptions: [5, 10, 20],
        search: false,
      }}
      editable={{
        onRowAdd: (newData) => new Promise((resolve) => additem(newData, resolve)),
        onRowUpdate: (newData, oldData) => new Promise((resolve) => updateitem(oldData, newData, resolve)),
        onRowDelete: (oldData) => new Promise((resolve) => removeitem(oldData, resolve)),
      }}
    />
  );
}

export default ChemicalManagement;
