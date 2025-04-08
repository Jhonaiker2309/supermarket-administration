import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import { useProductContext } from "./context/ProductContext";

export default function App() {
  const { addProduct, updateProduct, deleteProduct } = useProductContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [price, setPrice] = useState(0);

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
      <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
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
      </Box>
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
