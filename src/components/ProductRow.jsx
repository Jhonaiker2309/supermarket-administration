import React, { useState } from 'react';
import { TableRow, TableCell, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageCarouselModal from './ImageCarousel';
import EditProductModal from './EditProductModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function ProductRow({ product, price, onDelete }) {
  const [openCarousel, setOpenCarousel] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const handleOpenCarousel = () => setOpenCarousel(true);
  const handleCloseCarousel = () => setOpenCarousel(false);

  const handleEdit = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleDelete = () => setOpenDeleteConfirm(true);
  const handleCloseDeleteConfirm = () => setOpenDeleteConfirm(false);

  return (
    <>
      <TableRow hover>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.brand}</TableCell>
        <TableCell>{product.store}</TableCell>
        <TableCell>${product.price}</TableCell>
        <TableCell>{(product.price * price).toFixed(2)}</TableCell>
        <TableCell>
          <Button variant="contained" onClick={handleOpenCarousel}>
            Abrir imágenes
          </Button>
        </TableCell>
        <TableCell>
          <IconButton color="primary" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <ImageCarouselModal open={openCarousel} onClose={handleCloseCarousel} images={product.images} />

      <EditProductModal open={openEditModal} onClose={handleCloseEditModal} product={product} />

      <ConfirmDeleteModal
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        product={product}
      />
    </>
  );
}