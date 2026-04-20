import React from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable, { MTableToolbar } from '../config/MaterialTable';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import PageTitle from '../components/PageTitle';
import {
  useGetLeasesQuery,
  useAddLeaseMutation,
  useUpdateLeaseMutation,
  useDeleteLeaseMutation,
} from '../store/api/leasesApi';
import { showToast } from '../store/slices/uiSlice';

const columns = [
  { title: "id", field: "id", hidden: true },
  { title: "Name", field: "name" },
];

function LeaseManagement() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const companyid = location.state.id;

  const { data, isFetching } = useGetLeasesQuery({ company: companyid, limit: 1000 });
  const [addLease] = useAddLeaseMutation();
  const [updateLease] = useUpdateLeaseMutation();
  const [deleteLease] = useDeleteLeaseMutation();

  const rows = data?.data ?? [];

  const additem = async (incoming) => {
    if (!incoming.name) {
      dispatch(showToast({ severity: 'warning', message: 'Please enter lease name' }));
      return;
    }
    try {
      await addLease({ name: incoming.name, company: companyid }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Lease added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add lease' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    if (!incoming.name) {
      dispatch(showToast({ severity: 'warning', message: 'Please enter lease name' }));
      return;
    }
    try {
      await updateLease({ id: oldData.id, name: incoming.name, company: companyid }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Lease updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update lease' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteLease(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Lease deleted' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to delete lease' }));
    }
  };

  const goToWells = (event, rowData) => {
    history.push({
      pathname: '/locationmanagment/leasemanagment/wellmanagment',
      state: { leaseid: rowData.id, companyid },
    });
  };
  const back = () => history.push("/locationmanagment/");

  return (
    <div>
      <PageTitle>Lease Management</PageTitle>
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
        actions={[
          {
            icon: 'sort',
            tooltip: 'Manage Wells',
            onClick: (event, rowData) => goToWells(event, rowData),
          },
        ]}
      />
    </div>
  );
}

export default LeaseManagement;
