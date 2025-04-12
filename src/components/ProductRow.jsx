import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditProductModal from "./EditProductModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function ProductRow({ product, onDelete, price }) {
  console.log(product);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // Opciones para weight_prices: se espera un array de objetos { price: number, weight: number }
  const weightOptions = product.weight_prices || [];
  // Estado para la opción seleccionada; se inicializa con 0 (la primera opción) si existe
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(
    weightOptions.length > 0 ? 0 : null
  );

  const handleEdit = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleDelete = () => setOpenDeleteConfirm(true);
  const handleCloseDeleteConfirm = () => setOpenDeleteConfirm(false);

  const handleWeightChange = (event) => {
    setSelectedWeightIndex(event.target.value);
  };

  // Obtiene la opción seleccionada para mostrar su precio y peso
  const selectedWeight =
    weightOptions.length && selectedWeightIndex !== null
      ? weightOptions[selectedWeightIndex]
      : null;

  // Cálculos:
  // Precio en dólares y Bs. según el peso seleccionado
  const priceUsd = selectedWeight ? selectedWeight.price : null;
  const priceBs = selectedWeight ? selectedWeight.price * price : null;
  // Precio por kilo: se supone que weight está en gramos
  const priceKiloUsd =
    selectedWeight && selectedWeight.weight > 0
      ? (selectedWeight.price / selectedWeight.weight) * 1000
      : null;
  const priceKiloBs = priceKiloUsd ? priceKiloUsd * price : null;

  return (
    <>
      <TableRow hover>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.brand}</TableCell>
        <TableCell>{product.store}</TableCell>
        <TableCell>
          {weightOptions.length > 0 ? (
            <FormControl fullWidth variant="outlined" size="small">
              <Select
                labelId={`weight-select-label-${product.name}`}
                id={`weight-select-${product.name}`}
                value={selectedWeightIndex}
                onChange={handleWeightChange}
              >
                {weightOptions.map((option, index) => (
                  <MenuItem key={index} value={index}>
                    {option.weight} g
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>
          {selectedWeight ? `$${priceUsd.toFixed(2)}` : "N/A"}
        </TableCell>
        <TableCell>
          {selectedWeight ? `${priceBs.toFixed(2)} Bs` : "N/A"}
        </TableCell>
        <TableCell>
          {selectedWeight && selectedWeight.weight > 0
            ? `$${priceKiloUsd.toFixed(2)}`
            : "N/A"}
        </TableCell>
        <TableCell>
          {selectedWeight && selectedWeight.weight > 0
            ? `${priceKiloBs.toFixed(2)} Bs`
            : "N/A"}
        </TableCell>
        <TableCell>
          {product.date
            ? new Date(product.date).toLocaleString("es-VE", {
                timeZone: "America/Caracas",
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </TableCell>
        <TableCell>
          {product.images ? (
            <a href={product.images} target="_blank" rel="noopener noreferrer">
              Ver Imagenes
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
              Visitar Tienda
            </a>
          ) : (
            "N/A"
          )}
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

      <EditProductModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        product={product}
      />

      <ConfirmDeleteModal
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        product={product}
      />
    </>
  );
}
