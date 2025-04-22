import React, { useState } from "react";
import {
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete, Edit, Link as LinkIcon } from "@mui/icons-material";
import EditProductModal from "./EditProductModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { getDecimals } from "../utils";

export default function ProductCard({ product, onDelete, onEdit, price }) {
  const theme = useTheme();

  // modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const handleEditOpen = () => setOpenEditModal(true);
  const handleEditClose = () => setOpenEditModal(false);
  const handleDeleteOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteClose = () => setOpenDeleteConfirm(false);

  // opciones peso/precio
  const weightOptions = product.weight_prices || [];
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(
    weightOptions.length > 0 ? 0 : null
  );
  const handleWeightChange = (e) => setSelectedWeightIndex(e.target.value);

  const selected =
    selectedWeightIndex !== null ? weightOptions[selectedWeightIndex] : null;

  // cálculos
  const priceUsd = selected ? selected.price : null;
  const priceBs = priceUsd != null ? priceUsd * price : null;
  const priceKiloUsd =
    selected && selected.weight > 0
      ? (selected.price / selected.weight) * 1000
      : null;
  const priceKiloBs = priceKiloUsd != null ? priceKiloUsd * price : null;

  // fecha formateada
  const formatDate = (d) =>
    new Date(d).toLocaleString("es-VE", {
      timeZone: "America/Caracas",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <>
      <Paper
        sx={{
          mb: 2,
          p: 2,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.brand} — {product.store}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Peso:</Typography>
            {weightOptions.length > 0 ? (
              <FormControl fullWidth size="small">
                <Select
                  value={selectedWeightIndex}
                  onChange={handleWeightChange}
                  displayEmpty
                  renderValue={(v) =>
                    v !== null ? `${weightOptions[v].weight} g` : "Seleccionar"
                  }
                >
                  {weightOptions.map((opt, i) => (
                    <MenuItem key={i} value={i}>
                      {opt.weight} g
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography>N/A</Typography>
            )}
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Precio ($):</Typography>
            <Typography>
              {priceUsd != null ? `$${getDecimals(priceUsd)}` : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Precio (Bs):</Typography>
            <Typography>
              {priceBs != null ? `${getDecimals(priceBs)} Bs` : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Precio kilo ($):</Typography>
            <Typography>
              {priceKiloUsd != null ? `$${getDecimals(priceKiloUsd)}` : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Precio kilo (Bs):</Typography>
            <Typography>
              {priceKiloBs != null ? `${getDecimals(priceKiloBs)} Bs` : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Fecha:</Typography>
            <Typography>
              {product.date ? formatDate(product.date) : "N/A"}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Tooltip title="Ver imágenes" arrow>
              <IconButton
                color="primary"
                component="a"
                href={product.images}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Box>
              <Tooltip title="Eliminar producto" arrow>
                <IconButton onClick={handleDeleteOpen}>
                  <Delete color="error" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar producto" arrow>
                <IconButton onClick={handleEditOpen}>
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <EditProductModal
        open={openEditModal}
        onClose={handleEditClose}
        product={product}
        onSave={(updated) => {
          onEdit(updated);
          handleEditClose();
        }}
      />

      <ConfirmDeleteModal
        open={openDeleteConfirm}
        onClose={handleDeleteClose}
        onConfirm={() => {
          onDelete(product);
          handleDeleteClose();
        }}
        product={product}
      />
    </>
  );
}
