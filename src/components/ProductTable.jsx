import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import ProductRow from './ProductRow';
import { useProductContext } from '../context/ProductContext';

export default function ProductTable({ onAdd, price }) {
  const { products, deleteProduct } = useProductContext();

  const handleDelete = (product) => {
    deleteProduct(product); // Llama a la función del contexto para eliminar el producto
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={onAdd}>
          Agregar Producto
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Marca</strong></TableCell>
              <TableCell><strong>Tienda</strong></TableCell>
              <TableCell><strong>Precio ($)</strong></TableCell>
              <TableCell><strong>Precio (Bs.)</strong></TableCell>
              <TableCell><strong>Imágenes</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <ProductRow
                key={index}
                product={product}
                onDelete={handleDelete}
                price={price}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}