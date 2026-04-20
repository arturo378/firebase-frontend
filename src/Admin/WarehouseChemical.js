import React from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable, { MTableToolbar } from '../config/MaterialTable';
import { useHistory, useLocation } from "react-router-dom";
import { Select, MenuItem } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import PageTitle from '../components/PageTitle';
import { useGetChemicalsQuery } from '../store/api/chemicalsApi';
import {
  useGetWarehouseChemicalsQuery,
  useAddWarehouseChemicalMutation,
  useUpdateWarehouseChemicalMutation,
  useDeleteWarehouseChemicalMutation,
} from '../store/api/warehouseChemicalsApi';
import { showToast } from '../store/slices/uiSlice';

function WarehouseChemical() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const warehouseid = location.state.id;

  const { data: chemicalsData } = useGetChemicalsQuery({ limit: 100 });
  const chemicals = chemicalsData?.data ?? [];

  const { data, isFetching } = useGetWarehouseChemicalsQuery({ warehouse: warehouseid, limit: 1000 });
  const [addWarehouseChemical] = useAddWarehouseChemicalMutation();
  const [updateWarehouseChemical] = useUpdateWarehouseChemicalMutation();
  const [deleteWarehouseChemical] = useDeleteWarehouseChemicalMutation();

  const rows = data?.data ?? [];

  const additem = async (incoming) => {
    if (!incoming.chemical) {
      dispatch(showToast({ severity: 'warning', message: 'Please select a chemical' }));
      return;
    }
    try {
      await addWarehouseChemical({
        chemical: incoming.chemical,
        quantity: incoming.quantity,
        warehouse: warehouseid,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Inventory added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add inventory' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    try {
      await updateWarehouseChemical({
        id: oldData.id,
        chemical: incoming.chemical,
        quantity: incoming.quantity,
        warehouse: warehouseid,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Inventory updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update inventory' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteWarehouseChemical(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Inventory removed' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to remove inventory' }));
    }
  };

  const back = () => history.push({ pathname: '/warehousemanagement' });

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
    <div>
      <PageTitle>Warehouse Inventory</PageTitle>
      <MaterialTable
        columns={columns}
        data={rows}
        isLoading={isFetching}
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
          onRowAdd: (newData) => additem(newData),
          onRowUpdate: (newData, oldData) => updateitem(oldData, newData),
          onRowDelete: (oldData) => removeitem(oldData),
        }}
      />
    </div>
  );
}

export default WarehouseChemical;
