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

export default function ProductTable({ onAdd, onEdit, onDelete, price }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { products } = useProductContext();  // only need products here

  // Estados para filtros
  const [filterName, setFilterName] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStore, setFilterStore] = useState("");

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Grid container spacing={2}>
          <Grid item size={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={onAdd}
              sx={{ height: "44px" }}
            >
              Agregar Producto
            </Button>
          </Grid>

          {[ 
            { value: filterName, setter: setFilterName, label: "Filtrar por Nombre" },
            { value: filterBrand, setter: setFilterBrand, label: "Filtrar por Marca" },
            { value: filterStore, setter: setFilterStore, label: "Filtrar por Tienda" },
          ].map((filter, idx) => (
            <Grid item size={{ xs: 12, md: 4 }} key={idx}>
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
          <Box sx={{ mt: 2 }}>
            {paginatedProducts.map((product, idx) => (
              <ProductCard
                key={idx}
                product={product}
                onDelete={onDelete}
                onEdit={onEdit}
                price={price}
              />
            ))}
          </Box>
        ) : (
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
                {paginatedProducts.map((product, idx) => (
                  <ProductRow
                    key={idx}
                    product={product}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    price={price}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

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