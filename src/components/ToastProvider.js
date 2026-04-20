import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { selectToasts, dismissToast } from '../store/slices/uiSlice';

const COLORS = {
  success: { backgroundColor: '#166534', color: '#ffffff' },
  error:   { backgroundColor: '#b91c1c', color: '#ffffff' },
  warning: { backgroundColor: '#b45309', color: '#ffffff' },
  info:    { backgroundColor: '#1e40af', color: '#ffffff' },
};

export default function ToastProvider() {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();

  return (
    <>
      {toasts.map((t, idx) => (
        <Snackbar
          key={t.id}
          open
          autoHideDuration={t.duration ?? 4000}
          onClose={() => dispatch(dismissToast(t.id))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          style={{ bottom: 24 + idx * 64 }}
          ContentProps={{
            style: { ...(COLORS[t.severity] || COLORS.info), fontWeight: 500 },
          }}
          message={t.message}
          action={
            <IconButton size="small" color="inherit" onClick={() => dispatch(dismissToast(t.id))}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      ))}
    </>
  );
}
