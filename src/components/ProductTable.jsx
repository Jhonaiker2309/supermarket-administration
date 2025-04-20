import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  TablePagination,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ProductRow from "./ProductRow";
import ProductCard from "./ProductCard";
import { useProductContext } from "../context/ProductContext";

export default function ProductTable({ onAdd, price }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { products, deleteProduct } = useProductContext();

  // Estados para filtros
  const [filterName, setFilterName] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStore, setFilterStore] = useState("");

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDelete = (product) => {
    deleteProduct(product);
  };

  // Filtrar los productos
  const filteredProducts = products.filter(
    (product) =>
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
    <Box sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      {/* Contenido scrollable (filtros, botón y tabla) */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* Filtros y botón (ubicados arriba) */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onAdd}
              sx={{
                height: "56px", // Cambia la altura del botón
              }}
            >
              Agregar Producto
            </Button>
          </Grid>

          {/* Campos de filtrado */}
          {[
            {
              value: filterName,
              setter: setFilterName,
              label: "Filtrar por Nombre",
            },
            {
              value: filterBrand,
              setter: setFilterBrand,
              label: "Filtrar por Marca",
            },
            {
              value: filterStore,
              setter: setFilterStore,
              label: "Filtrar por Tienda",
            },
          ].map((filter, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <TextField
                fullWidth
                size="small"
                label={filter.label}
                value={filter.value}
                onChange={(e) => filter.setter(e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
        {isMobile ? (
          // Vista móvil con Cards
          <Box sx={{ mt: 2 }}>
            {paginatedProducts.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                onDelete={handleDelete}
                price={price}
              />
            ))}
          </Box>
        ) : (
          // Vista desktop con Tabla
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Nombre</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Marca</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tienda</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Peso</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Precio ($)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Precio (Bs.)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Precio kilo ($)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Precio kilo (Bs.)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Imágenes</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Visitar Tienda</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Acciones</strong>
                  </TableCell>
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
        )}
      </Box>

      {/* Área fija inferior: solo paginación */}
      <Box sx={{ borderTop: "1px solid #ddd", backgroundColor: "white" }}>
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
