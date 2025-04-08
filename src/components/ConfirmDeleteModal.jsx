import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useProductContext } from '../context/ProductContext';

export default function ConfirmDeleteModal({ open, onClose, product }) {
  const { deleteProduct } = useProductContext();

  const handleConfirm = () => {
    deleteProduct(product);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>¿Estás seguro?</DialogTitle>
      <DialogContent>
        ¿Estás seguro de que deseas eliminar el producto <strong>{product.name}</strong>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}