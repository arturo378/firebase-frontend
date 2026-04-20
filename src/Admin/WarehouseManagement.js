import React from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable from '../config/MaterialTable';
import { useHistory } from "react-router-dom";
import PageTitle from '../components/PageTitle';
import {
  useGetWarehousesQuery,
  useAddWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} from '../store/api/warehousesApi';
import { showToast } from '../store/slices/uiSlice';

const columns = [
  { title: "id", field: "id", hidden: true },
  { title: "Warehouse Number", field: "warehousenumber" },
  { title: "Name", field: "name" },
  { title: "Area Manager", field: "areamanager" },
];

function WarehouseManagement() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { data, isFetching } = useGetWarehousesQuery({ limit: 1000 });
  const [addWarehouse] = useAddWarehouseMutation();
  const [updateWarehouse] = useUpdateWarehouseMutation();
  const [deleteWarehouse] = useDeleteWarehouseMutation();

  const rows = data?.data ?? [];

  const additem = async (incoming) => {
    const errors = [];
    if (!incoming.name) errors.push("name");
    if (!incoming.warehousenumber) errors.push("warehouse number");
    if (!incoming.areamanager) errors.push("area manager");
    if (errors.length > 0) {
      dispatch(showToast({ severity: 'warning', message: `Please enter ${errors.join(', ')}` }));
      return;
    }
    try {
      await addWarehouse({
        warehousenumber: incoming.warehousenumber,
        name: incoming.name,
        areamanager: incoming.areamanager,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Warehouse added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add warehouse' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    try {
      await updateWarehouse({
        id: oldData.id,
        warehousenumber: incoming.warehousenumber,
        name: incoming.name,
        areamanager: incoming.areamanager,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Warehouse updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update warehouse' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteWarehouse(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Warehouse deleted' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to delete warehouse' }));
    }
  };

  const goToInventory = (event, rowData) => {
    history.push({ pathname: '/warehousechemical', state: rowData });
  };

  return (
    <div>
      <PageTitle>Warehouses</PageTitle>
      <MaterialTable
        columns={columns}
        data={rows}
        isLoading={isFetching}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          search: false,
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) => additem(newData),
          onRowUpdate: (newData, oldData) => updateitem(oldData, newData),
          onRowDelete: (oldData) => removeitem(oldData),
        }}
        actions={[
          {
            icon: 'science',
            tooltip: 'Manage Inventory',
            onClick: (event, rowData) => goToInventory(event, rowData),
          },
        ]}
      />
    </div>
  );
}

export default WarehouseManagement;
