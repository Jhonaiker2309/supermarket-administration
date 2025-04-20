import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import { useProductContext } from "./context/ProductContext";

export default function App() {
  const { addProduct, updateProduct, deleteProduct, dolarOptions } =
    useProductContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [price, setPrice] = useState(0);
  const [savedDate, setSavedDate] = useState(null);
  const [selectedDolar, setSelectedDolar] = useState("");

  // Cargar la tasa guardada y su fecha desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("exchangeRate");
    if (stored) {
      try {
        const { price: storedPrice, date } = JSON.parse(stored);
        setPrice(storedPrice);
        setSavedDate(date);
      } catch (error) {
        console.error("Error al parsear exchangeRate:", error);
      }
    }
  }, []);

  // Guarda la tasa y la fecha (en formato ISO) en localStorage
  const handleSaveRate = () => {
    const now = new Date();
    const nowISOString = now.toISOString();
    localStorage.setItem(
      "exchangeRate",
      JSON.stringify({ price, date: nowISOString })
    );
    setSavedDate(nowISOString);
  };

  // Manejar la selección de un valor del dólar
  const handleSelectDolar = (e) => {
    const id = e.target.value;
    setSelectedDolar(id);
    const selectedOption = dolarOptions.find((option) => option.id === id);
    if (selectedOption) {
      setPrice(selectedOption.value);
      setSavedDate(selectedOption.date);
      localStorage.setItem(
        "exchangeRate",
        JSON.stringify({
          price: selectedOption.value,
          date: selectedOption.date,
        })
      );
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (product) => {
    deleteProduct(product);
  };

  const handleSave = (productData) => {
    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Productos
      </Typography>
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Valores Dólar</InputLabel>
          <Select value={selectedDolar} onChange={handleSelectDolar}>
            {dolarOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {`$${
                  isNaN(option.value) ? "N/A" : option.value.toFixed(2)
                } — ${new Date(option.date).toLocaleString("es-VE", {
                  timeZone: "America/Caracas",
                })}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Tasa de cambio"
          type="number"
          value={price}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
              setPrice(value === "" ? "" : Number(value));
            }
          }}
          inputProps={{ step: 0.1 }}
        />
        <Button variant="contained" onClick={handleSaveRate}>
          Guardar Tasa
        </Button>
      </Box>
      {savedDate && (
        <Typography variant="caption" align="center" display="block">
          Tasa guardada:{" "}
          {new Date(savedDate).toLocaleString("es-VE", {
            timeZone: "America/Caracas",
          })}
        </Typography>
      )}
      <ProductTable
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        price={price}
      />
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
      />
    </Box>
  );
}
