import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useProductContext } from '../context/ProductContext';

export default function ConfirmDeleteModal({ open, onClose, product }) {
  const { deleteProduct } = useProductContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleConfirm = () => {
    deleteProduct(product);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isMobile ? "xs" : "sm"}
      sx={{
        "& .MuiDialog-paper": { padding: theme.spacing(2) },
      }}
    >
      <DialogTitle>
        <Typography variant={isMobile ? "h6" : "h5"} align="center">
          ¿Estás seguro?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" align="center">
          ¿Estás seguro de que deseas eliminar el producto <strong>{product.name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1,
          justifyContent: 'center',
          px: 2,
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{ maxWidth: isMobile ? '100%' : 'auto' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          fullWidth={isMobile}
          sx={{ maxWidth: isMobile ? '100%' : 'auto' }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}