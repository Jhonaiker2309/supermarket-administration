import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

export default function ProductModal({ open, onClose, onSave, product }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    store: '',
    price: '',
    link: '',
    images: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({
        name: '',
        brand: '',
        store: '',
        price: '',
        link: '',
        images: [],
      });
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result tiene el formato "data:[mime];base64,...."
        const base64Data = reader.result.split(',')[1]; // extrae sólo la cadena base64
        const newImages = [...formData.images];
        newImages[index] = { data: base64Data, mimeType: file.type };
        setFormData((prev) => ({ ...prev, images: newImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, null] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSave = () => {
    // Filtra las imágenes vacías o sin datos antes de enviarlas
    const validImages = formData.images.filter(
      (img) => img && img.data
    );
    onSave({ ...formData, images: validImages });
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
          <TextField label="Precio" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth />
          <TextField label="Link" name="link" value={formData.link} onChange={handleChange} fullWidth />
          <Typography variant="subtitle1">Imágenes</Typography>
          {formData.images.map((img, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant="outlined" component="label" fullWidth>
                {img ? 'Imagen cargada' : `Seleccionar Imagen ${index + 1}`}
                <input type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, index)} />
              </Button>
              <IconButton color="error" onClick={() => removeImageField(index)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
          <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={addImageField}>
            Agregar Imagen
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