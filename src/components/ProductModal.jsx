import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

export default function ProductModal({ open, onClose, onSave, product }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    store: '',
    store_link: '',
    images: '', // Ahora se usará como un único URL (string)
    weight_prices: [], // Array de objetos { price, weight }
  });

  useEffect(() => {
    if (product) {
      setFormData({ 
        ...product,
        weight_prices: product.weight_prices || [],
        images: product.images || '', // Se espera que este campo sea un string
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        store: '',
        store_link: '',
        images: '',
        weight_prices: [],
      });
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Funciones para modificar el array de weight_prices
  const handleWeightPricesChange = (index, field, value) => {
    const newWeightPrices = [...formData.weight_prices];
    newWeightPrices[index] = {
      ...newWeightPrices[index],
      [field]: field === 'weight' || field === 'price' ? (value === '' ? '' : Number(value)) : value,
    };
    setFormData((prev) => ({ ...prev, weight_prices: newWeightPrices }));
  };

  const addWeightPricesField = () => {
    setFormData((prev) => ({ 
      ...prev, 
      weight_prices: [...prev.weight_prices, { price: '', weight: '' }] 
    }));
  };

  const removeWeightPricesField = (index) => {
    const newWeightPrices = formData.weight_prices.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, weight_prices: newWeightPrices }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField label="Marca" name="brand" value={formData.brand} onChange={handleChange} fullWidth />
          <TextField label="Tienda" name="store" value={formData.store} onChange={handleChange} fullWidth />
          <TextField label="Link de tienda" name="store_link" value={formData.link} onChange={handleChange} fullWidth />
          <TextField
            label="URL de la Imagen"
            name="images"
            value={formData.images}
            onChange={handleChange}
            fullWidth
          />

          <Typography variant="subtitle1">Peso y Precio</Typography>
          {formData.weight_prices.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField 
                label="Peso (g)" 
                type="number" 
                value={item.weight} 
                onChange={(e) => handleWeightPricesChange(index, 'weight', e.target.value)} 
              />
              <TextField 
                label="Precio" 
                type="number" 
                value={item.price} 
                onChange={(e) => handleWeightPricesChange(index, 'price', e.target.value)} 
              />
              <IconButton color="error" onClick={() => removeWeightPricesField(index)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
          <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={addWeightPricesField}>
            Agregar Peso y Precio
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}