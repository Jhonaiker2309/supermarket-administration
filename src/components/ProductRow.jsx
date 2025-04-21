import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditProductModal from "./EditProductModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function ProductRow({ product, onDelete, onEdit, price }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // peso/precio options
  const weightOptions = product.weight_prices || [];
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(
    weightOptions.length > 0 ? 0 : null
  );
  const handleWeightChange = (e) => setSelectedWeightIndex(e.target.value);
  const selectedWeight =
    selectedWeightIndex !== null ? weightOptions[selectedWeightIndex] : null;

  // cálculos
  const priceUsd = selectedWeight ? selectedWeight.price : null;
  const priceBs = priceUsd != null ? priceUsd * price : null;
  const priceKiloUsd =
    selectedWeight && selectedWeight.weight > 0
      ? (selectedWeight.price / selectedWeight.weight) * 1000
      : null;
  const priceKiloBs = priceKiloUsd != null ? priceKiloUsd * price : null;

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

  // handlers for modals
  const handleEditOpen = () => setOpenEditModal(true);
  const handleEditClose = () => setOpenEditModal(false);
  const handleDeleteOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteClose = () => setOpenDeleteConfirm(false);

  return (
    <>
      <TableRow hover>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.brand}</TableCell>
        <TableCell>{product.store}</TableCell>
        <TableCell>
          {weightOptions.length > 0 ? (
            <FormControl fullWidth size="small">
              <Select
                value={selectedWeightIndex}
                onChange={handleWeightChange}
              >
                {weightOptions.map((opt, i) => (
                  <MenuItem key={i} value={i}>
                    {opt.weight} g
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>
          {priceUsd != null ? `$${priceUsd}` : "N/A"}
        </TableCell>
        <TableCell>
          {priceBs != null ? `${priceBs} Bs` : "N/A"}
        </TableCell>
        <TableCell>
          {priceKiloUsd != null ? `$${priceKiloUsd}` : "N/A"}
        </TableCell>
        <TableCell>
          {priceKiloBs != null ? `${priceKiloBs} Bs` : "N/A"}
        </TableCell>
        <TableCell>
          {product.date ? formatDate(product.date) : "N/A"}
        </TableCell>
        <TableCell>
          {product.images ? (
            <a href={product.images} target="_blank" rel="noopener noreferrer">
              Ver Imágenes
            </a>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>
          {product.store_link ? (
            <a
              href={product.store_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Link de tienda
            </a>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>
          <Tooltip title="Editar producto" arrow>
            <IconButton color="primary" onClick={handleEditOpen}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar producto" arrow>
            <IconButton color="error" onClick={handleDeleteOpen}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

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