import React from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable, { MTableToolbar } from '../config/MaterialTable';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { Select, MenuItem } from "@material-ui/core";
import PageTitle from '../components/PageTitle';
import { useGetChemicalsQuery } from '../store/api/chemicalsApi';
import {
  useGetPricingQuery,
  useAddPricingMutation,
  useUpdatePricingMutation,
  useDeletePricingMutation,
} from '../store/api/pricingApi';
import { showToast } from '../store/slices/uiSlice';

function Pricing() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const companyid = location.state.id;

  const { data: chemicalsData } = useGetChemicalsQuery({ limit: 100 });
  const chemicals = chemicalsData?.data ?? [];

  const { data, isFetching } = useGetPricingQuery({ company: companyid, limit: 1000 });
  const [addPricing] = useAddPricingMutation();
  const [updatePricing] = useUpdatePricingMutation();
  const [deletePricing] = useDeletePricingMutation();

  const rows = data?.data ?? [];

  const additem = async (incoming) => {
    if (!incoming.chemical || !incoming.price) {
      dispatch(showToast({ severity: 'warning', message: 'Please select a chemical and price' }));
      return;
    }
    try {
      await addPricing({
        chemical: incoming.chemical,
        price: incoming.price,
        company: companyid,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Pricing added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add pricing' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    try {
      await updatePricing({
        id: oldData.id,
        chemical: incoming.chemical,
        price: incoming.price,
        company: companyid,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Pricing updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update pricing' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deletePricing(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Pricing deleted' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to delete pricing' }));
    }
  };

  const back = () => history.push("/locationmanagment/");

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

export default Pricing;
