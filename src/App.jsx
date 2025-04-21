import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for deleting
import EditIcon from "@mui/icons-material/Edit"; // Icon for editing
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import DolarModal from "./components/DolarModal"; // Import DolarModal
import ConfirmDeleteDolarModal from "./components/ConfirmDeleteDolarModal"; // Import ConfirmDeleteDolarModal
import { useProductContext } from "./context/ProductContext";

// Helper function for consistent date formatting
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("es-VE", {
    timeZone: "America/Caracas",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function App() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    dolarOptions,
    addDolar,
    updateDolar,
    deleteDolar,
  } = useProductContext();

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dolarModalOpen, setDolarModalOpen] = useState(false);
  const [editingDolar, setEditingDolar] = useState(null);
  const [deleteDolarModalOpen, setDeleteDolarModalOpen] = useState(false);
  const [dolarToDelete, setDolarToDelete] = useState(null);
  const [price, setPrice] = useState(0);
  const [selectedDolar, setSelectedDolar] = useState(null);

  useEffect(() => {
    if (dolarOptions && dolarOptions.length > 0) {
      if (!selectedDolar) {
        const sortedOptions = [...dolarOptions].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const latestOption = sortedOptions[0];
        setSelectedDolar(latestOption);
        setPrice(latestOption ? latestOption.value : 0);
      } else if (!dolarOptions.some((opt) => opt.id === selectedDolar.id)) {
        const sortedOptions = [...dolarOptions].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const latestOption = sortedOptions[0];
        setSelectedDolar(latestOption || null);
        setPrice(latestOption ? latestOption.value : 0);
      }
    } else {
      setSelectedDolar(null);
      setPrice(0);
    }
  }, [dolarOptions]);

  const handleSelectDolar = (event, newValue) => {
    setSelectedDolar(newValue);
    setPrice(newValue ? newValue.value : 0);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setPrice(value === "" ? 0 : Number(value));
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    deleteProduct(product);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    setProductModalOpen(false);
  };

  const handleAddDolar = () => {
    setEditingDolar(null);
    setDolarModalOpen(true);
  };

  const handleEditDolar = (dolarRate) => {
    setEditingDolar(dolarRate);
    setDolarModalOpen(true);
  };

  const handleDeleteDolar = (dolarRate) => {
    setDolarToDelete(dolarRate);
    setDeleteDolarModalOpen(true);
  };

  const handleSaveDolar = (dolarData) => {
    if (editingDolar) {
      updateDolar({ ...dolarData, id: editingDolar.id });
    } else {
      addDolar(dolarData);
    }
    setDolarModalOpen(false);
  };

  const confirmDeleteDolarHandler = (dolarId) => {
    deleteDolar(dolarId);
    setDeleteDolarModalOpen(false);
    setDolarToDelete(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Section for selecting/viewing the exchange rate */}
      <Box
        sx={{
          my: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Autocomplete for selecting dollar rate by date */}
        <Autocomplete
          id="dolar-rate-select"
          options={dolarOptions || []}
          getOptionLabel={(option) =>
            option
              ? `$${isNaN(option.value) ? "N/A" : option.value} — ${formatDate(
                  option.date
                )}`
              : ""
          }
          value={selectedDolar}
          onChange={handleSelectDolar}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Tasa por Fecha"
              variant="outlined"
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span>
                {`$${isNaN(option.value) ? "N/A" : option.value} — ${formatDate(
                  option.date
                )}`}
              </span>
              <Box sx={{ ml: 2 }}>
                <Tooltip title="Editar Tasa">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDolar(option);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar Tasa">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDolar(option);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
          sx={{ width: { xs: "100%", sm: "400px" } }}
          disabled={!dolarOptions || dolarOptions.length === 0}
        />

        <TextField
          label="Tasa de cambio Actual"
          type="number"
          value={price}
          onChange={handlePriceChange}
          inputProps={{ step: 0.1 }}
          sx={{ width: { xs: "100%", sm: "200px" } }}
        />
        <Button
          variant="contained"
          onClick={handleAddDolar}
          sx={{ width: { xs: "100%", sm: "200px" }, height: "56px" }}
        >
          Agregar Nueva Tasa
        </Button>
      </Box>

      {/* Display the date of the currently selected rate */}
      {selectedDolar && (
        <Typography
          variant="caption"
          align="center"
          display="block"
          sx={{ mb: 2 }}
        >
          Tasa seleccionada del: {formatDate(selectedDolar.date)}
        </Typography>
      )}

      {/* Product Table */}
      <ProductTable
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onAdd={handleAddProduct}
        price={price}
      />

      {/* Product Modal (for Add/Edit) */}
      <ProductModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Dolar Modal (for Add/Edit Rates) */}
      <DolarModal
        open={dolarModalOpen}
        onClose={() => setDolarModalOpen(false)}
        onSave={handleSaveDolar}
        dolar={editingDolar}
      />

      {/* Dolar Delete Confirmation Modal */}
      <ConfirmDeleteDolarModal
        open={deleteDolarModalOpen}
        onClose={() => setDeleteDolarModalOpen(false)}
        onConfirm={confirmDeleteDolarHandler}
        dolar={dolarToDelete}
      />
    </Box>
  );
}
