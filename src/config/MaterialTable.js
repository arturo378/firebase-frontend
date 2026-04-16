import React, { useRef, useEffect, useCallback } from 'react';
import MaterialTable, { MTablePagination, MTableToolbar } from 'material-table';
import { TablePagination, CircularProgress } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';

// Patch: material-table passes deprecated `onChangePage`/`onChangeRowsPerPage`
// to MUI's TablePagination. Remap them to the current prop names.
function PatchedPagination(props) {
  const { onChangePage, onChangeRowsPerPage, ...rest } = props;
  return (
    <TablePagination
      {...rest}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
    />
  );
}

// Patch: material-table's OverlayLoading uses the deprecated `fade` utility.
// Provide a replacement that uses `alpha`.
function PatchedOverlayLoading(props) {
  return (
    <div
      style={{
        display: 'table',
        width: '100%',
        height: '100%',
        backgroundColor: alpha('#fff', 0.7),
      }}
    >
      <div
        style={{
          display: 'table-cell',
          width: '100%',
          height: '100%',
          verticalAlign: 'middle',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={60} />
      </div>
    </div>
  );
}

export default function PatchedMaterialTable(props) {
  const mountedRef = useRef(true);
  const dataRef = useRef(props.data);
  dataRef.current = props.data;

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  // Wrap remote-data functions so the promise never resolves after unmount,
  // preventing material-table from calling setState on an unmounted component.
  const wrappedData = useCallback((query) => {
    return new Promise((resolve, reject) => {
      Promise.resolve(dataRef.current(query)).then(result => {
        if (mountedRef.current) resolve(result);
      }).catch(err => {
        if (mountedRef.current) reject(err);
      });
    });
  }, []);

  return (
    <MaterialTable
      {...props}
      data={typeof props.data === 'function' ? wrappedData : props.data}
      components={{
        Pagination: PatchedPagination,
        OverlayLoading: PatchedOverlayLoading,
        ...props.components,
      }}
    />
  );
}

export { MTablePagination, MTableToolbar };
