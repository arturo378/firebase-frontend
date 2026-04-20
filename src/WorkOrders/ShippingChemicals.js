import React from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable, { MTableToolbar } from '../config/MaterialTable';
import { useHistory, useLocation } from "react-router-dom";
import { Select, MenuItem } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import PageTitle from '../components/PageTitle';
import { useGetChemicalsQuery } from '../store/api/chemicalsApi';
import {
  useGetShippingChemicalsQuery,
  useAddShippingChemicalMutation,
  useUpdateShippingChemicalMutation,
  useDeleteShippingChemicalMutation,
} from '../store/api/shippingPapersApi';
import { showToast } from '../store/slices/uiSlice';

function ShippingChemicals() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const shippingPaperid = location.state.id;

  const { data: chemicalsData } = useGetChemicalsQuery({ limit: 100 });
  const chemicals = chemicalsData?.data ?? [];

  const { data, isFetching } = useGetShippingChemicalsQuery({ shippingPaper: shippingPaperid, limit: 1000 });
  const [addShippingChemical] = useAddShippingChemicalMutation();
  const [updateShippingChemical] = useUpdateShippingChemicalMutation();
  const [deleteShippingChemical] = useDeleteShippingChemicalMutation();

  const rows = data?.data ?? [];

  const additem = async (incoming) => {
    if (!incoming.chemical) {
      dispatch(showToast({ severity: 'warning', message: 'Please select a chemical' }));
      return;
    }
    try {
      await addShippingChemical({
        chemical: incoming.chemical,
        quantity: incoming.quantity,
        shippingPaper: shippingPaperid,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Chemical added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add chemical' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    try {
      await updateShippingChemical({
        id: oldData.id,
        chemical: incoming.chemical,
        quantity: incoming.quantity,
        shippingPaper: shippingPaperid,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Chemical updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update chemical' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteShippingChemical(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Chemical removed' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to remove chemical' }));
    }
  };

  const back = () => history.push({ pathname: '/shippingpapers' });

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
      <PageTitle>Shipping Paper: Chemicals</PageTitle>
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

export default ShippingChemicals;
