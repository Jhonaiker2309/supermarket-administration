import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export default function ConfirmDeleteDolarModal({ open, onClose, onConfirm, dolar }) {
  if (!dolar) return null; // Don't render if no dolar object is provided

  const formattedDate = new Date(dolar.date).toLocaleString('es-VE', {
    timeZone: 'America/Caracas',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleConfirm = () => {
    onConfirm(dolar.id); // Pass the ID to the confirmation handler
    onClose(); // Close the modal
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-delete-dialog-title"
      aria-describedby="confirm-delete-dialog-description"
    >
      <DialogTitle id="confirm-delete-dialog-title">Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-delete-dialog-description">
          ¿Estás seguro de que deseas eliminar la tasa de dólar
          <strong> ${dolar.value} </strong>
          registrada el
          <strong> {formattedDate}</strong>? Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} color="error" variant="contained" autoFocus>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}