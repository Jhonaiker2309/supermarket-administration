import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField, TablePagination } from '@mui/material';
import ProductRow from './ProductRow';
import { useProductContext } from '../context/ProductContext';

export default function ProductTable({ onAdd, price }) {
  const { products, deleteProduct } = useProductContext();

  // Estados para filtros
  const [filterName, setFilterName] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStore, setFilterStore] = useState('');

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDelete = (product) => {
    deleteProduct(product);
  };

  // Filtrar los productos
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterName.toLowerCase()) &&
    product.brand.toLowerCase().includes(filterBrand.toLowerCase()) &&
    product.store.toLowerCase().includes(filterStore.toLowerCase())
  );

  // Manejo de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Productos paginados
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Contenido scrollable (filtros, botón y tabla) */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {/* Filtros y botón (ubicados arriba) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Button variant="contained" onClick={onAdd}>
            Agregar Producto
          </Button>
          <TextField
            label="Filtrar por Nombre"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            size="small"
          />
          <TextField
            label="Filtrar por Marca"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            size="small"
          />
          <TextField
            label="Filtrar por Tienda"
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            size="small"
          />
        </Box>
        {/* Tabla */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Marca</strong></TableCell>
                <TableCell><strong>Tienda</strong></TableCell>
                <TableCell><strong>Peso</strong></TableCell>
                <TableCell><strong>Precio ($)</strong></TableCell>
                <TableCell><strong>Precio (Bs.)</strong></TableCell>
                <TableCell><strong>Precio kilo ($)</strong></TableCell>
                <TableCell><strong>Precio kilo (Bs.)</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>                
                <TableCell><strong>Imágenes</strong></TableCell>
                <TableCell><strong>Visitar Tienda</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product, index) => (
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

      {/* Área fija inferior: solo paginación */}
      <Box sx={{ borderTop: '1px solid #ddd', backgroundColor: 'white' }}>
        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </Box>
  );
}