import React from 'react';
import { useDispatch } from 'react-redux';
import MaterialTable from '../config/MaterialTable';
import PageTitle from '../components/PageTitle';
import {
  useGetChemicalsQuery,
  useAddChemicalMutation,
  useUpdateChemicalMutation,
  useDeleteChemicalMutation,
} from '../store/api/chemicalsApi';
import { showToast } from '../store/slices/uiSlice';

const columns = [
  { title: "id", field: "id", hidden: true },
  { title: "Trade Name", field: "tradename" },
  { title: "DOT Tag", field: "dottag" },
  { title: "Weight", field: "weight" },
];

function ChemicalManagement() {
  const dispatch = useDispatch();
  const { data, isFetching } = useGetChemicalsQuery({ limit: 1000 });
  const [addChemical] = useAddChemicalMutation();
  const [updateChemical] = useUpdateChemicalMutation();
  const [deleteChemical] = useDeleteChemicalMutation();

  const rows = data?.data ?? [];

  const additem = async (incoming) => {
    const errors = [];
    if (!incoming.tradename) errors.push("trade name");
    if (!incoming.dottag) errors.push("DOT tag");
    if (!incoming.weight) errors.push("weight");
    if (errors.length > 0) {
      dispatch(showToast({ severity: 'warning', message: `Please enter ${errors.join(', ')}` }));
      return;
    }
    try {
      await addChemical({
        tradename: incoming.tradename,
        dottag: incoming.dottag,
        weight: incoming.weight,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Chemical added' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to add chemical' }));
    }
  };

  const updateitem = async (oldData, newData) => {
    try {
      await updateChemical({
        id: oldData.id,
        tradename: newData.tradename,
        dottag: newData.dottag,
        weight: newData.weight,
      }).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Chemical updated' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to update chemical' }));
    }
  };

  const removeitem = async (row) => {
    try {
      await deleteChemical(row.id).unwrap();
      dispatch(showToast({ severity: 'success', message: 'Chemical deleted' }));
    } catch (err) {
      dispatch(showToast({ severity: 'error', message: err?.message || 'Failed to delete chemical' }));
    }
  };

  return (
    <div>
      <PageTitle>Product Management</PageTitle>
      <MaterialTable
        columns={columns}
        data={rows}
        isLoading={isFetching}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          search: false,
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

export default ChemicalManagement;
