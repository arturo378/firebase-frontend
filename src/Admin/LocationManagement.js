import React from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable from '../config/MaterialTable';
import { useHistory } from "react-router-dom";
import PageTitle from '../components/PageTitle';
import {
  useGetCompaniesQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} from '../store/api/companiesApi';
import { showToast } from '../store/slices/uiSlice';

const columns = [
  { title: "id", field: "id", hidden: true },
  { title: "Name", field: "name" },
  { title: "City", field: "city" },
  { title: "State", field: "state" },
  { title: "Zip Code", field: "zip" },
  { title: "Phone Number", field: "phone" },
];

function LocationManagement() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { data, isFetching } = useGetCompaniesQuery({ limit: 1000 });
  const [addCompany] = useAddCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();

  const rows = data?.data ?? [];

  const additem = async (incoming) => {
    const errors = [];
    if (!incoming.name) errors.push("name");
    if (!incoming.city) errors.push("city");
    if (!incoming.state) errors.push("state");
    if (errors.length > 0) {
      dispatch(showToast({ severity: 'warning', message: `Please enter ${errors.join(', ')}` }));
      return;
    }
    try {
      await addCompany({
        name: incoming.name,
        city: incoming.city,
        state: incoming.state,
        zip: incoming.zip,
        phone: incoming.phone,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Company added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add company' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    const errors = [];
    if (!incoming.name) errors.push("name");
    if (!incoming.city) errors.push("city");
    if (!incoming.state) errors.push("state");
    if (errors.length > 0) {
      dispatch(showToast({ severity: 'warning', message: `Please enter ${errors.join(', ')}` }));
      return;
    }
    try {
      await updateCompany({
        id: oldData.id,
        name: incoming.name,
        city: incoming.city,
        state: incoming.state,
        zip: incoming.zip,
        phone: incoming.phone,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Company updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update company' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteCompany(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Company deleted' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to delete company' }));
    }
  };

  const goToLeases = (event, rowData) => {
    history.push({ pathname: '/locationmanagment/leasemanagment', state: rowData });
  };
  const goToPricing = (event, rowData) => {
    history.push({ pathname: '/pricing', state: rowData });
  };

  return (
    <div>
      <PageTitle>Company Management</PageTitle>
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
    </div>
  );
}

export default LocationManagement;
