import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

export default function DolarModal({ open, onClose, onSave, dolar }) {
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Function to get the current date/time in YYYY-MM-DDTHH:mm format adjusted for local timezone
    const getLocalDateTimeString = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    if (open) { // Only reset/set values when the modal is opened
        if (dolar) {
            // Editing existing rate
            setValue(dolar.value || '');
            // Convert the incoming date (likely ISO string) to local YYYY-MM-DDTHH:mm
            const initialDate = dolar.date ? getLocalDateTimeString(new Date(dolar.date)) : '';
            setDate(initialDate);
        } else {
            // Adding new rate - default to current local date/time
            setValue('');
            setDate(getLocalDateTimeString(new Date()));
        }
    }
  }, [dolar, open]); // Reset form when modal opens or dolar prop changes

  const handleValueChange = (e) => {
    const inputValue = e.target.value;
    // Allow empty string or valid number format
    if (inputValue === '' || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleDateChange = (e) => {
    // The value from datetime-local input is already in YYYY-MM-DDTHH:mm format
    setDate(e.target.value);
  };

  const handleSaveClick = () => {
    if (!value || !date) {
      // Basic validation: ensure fields are not empty
      alert('Por favor, complete el valor y la fecha.');
      return;
    }

    // Convert the local YYYY-MM-DDTHH:mm string back to a Date object,
    // then to an ISO string (UTC) for consistent backend storage.
    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
        alert('Fecha inválida. Por favor, use el selector de fecha.');
        return;
    }

    const dolarData = {
      value: Number(value), // Ensure value is a number
      date: dateObject.toISOString(), // Convert to UTC ISO string
    };

    onSave(dolarData); // Pass data to parent component's save handler
    // Don't call handleClose here, let the parent decide after successful save if needed
    // handleClose();
  };

  const handleClose = () => {
    // Parent component's onClose function handles closing the dialog
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{dolar ? 'Editar Tasa de Dólar' : 'Agregar Nueva Tasa de Dólar'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="dolar-value"
            label="Valor de la Tasa"
            name="value"
            type="number"
            value={value}
            onChange={handleValueChange}
            inputProps={{ step: '0.01' }} // Allow decimal input
            autoFocus // Focus on this field first
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="dolar-date"
            label="Fecha y Hora"
            name="date"
            type="datetime-local" // Input for date and time
            value={date} // Should be in YYYY-MM-DDTHH:mm format
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true, // Keep label shrunk for datetime-local
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSaveClick} variant="contained">
          {dolar ? 'Guardar Cambios' : 'Agregar Tasa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}