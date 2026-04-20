import React from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable, { MTableToolbar } from '../config/MaterialTable';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import PageTitle from '../components/PageTitle';
import {
  useGetWellsQuery,
  useAddWellMutation,
  useUpdateWellMutation,
  useDeleteWellMutation,
} from '../store/api/wellsApi';
import { showToast } from '../store/slices/uiSlice';

const columns = [
  { title: "id", field: "id", hidden: true },
  { title: "Name", field: "name" },
  { title: "GPS Coordinates", field: "gps" },
  { title: "Description", field: "description" },
];

function WellManagement() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { leaseid, companyid } = location.state;

  const { data, isFetching } = useGetWellsQuery({ lease: leaseid, limit: 1000 });
  const [addWell] = useAddWellMutation();
  const [updateWell] = useUpdateWellMutation();
  const [deleteWell] = useDeleteWellMutation();

  const rows = data?.data ?? [];

  const additem = async (incoming) => {
    if (!incoming.name) {
      dispatch(showToast({ severity: 'warning', message: 'Please enter well name' }));
      return;
    }
    try {
      await addWell({
        name: incoming.name,
        gps: incoming.gps,
        description: incoming.description,
        lease: leaseid,
        company: companyid,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Well added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add well' }));
    }
  };

  const updateitem = async (oldData, incoming) => {
    if (!incoming.name) {
      dispatch(showToast({ severity: 'warning', message: 'Please enter well name' }));
      return;
    }
    try {
      await updateWell({
        id: oldData.id,
        name: incoming.name,
        gps: incoming.gps,
        description: incoming.description,
        lease: leaseid,
        company: companyid,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Well updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update well' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteWell(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Well deleted' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to delete well' }));
    }
  };

  const back = () => history.push({
    pathname: '/locationmanagment/leasemanagment',
    state: { id: companyid },
  });

  return (
    <div>
      <PageTitle>Well Management</PageTitle>
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
      />
    </div>
  );
}

export default WellManagement;
