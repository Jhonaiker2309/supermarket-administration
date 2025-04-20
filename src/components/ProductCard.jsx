import React from "react";
import {
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { Delete, Edit, Link } from "@mui/icons-material";

// Componente ProductCard para vista móvil
export default function ProductCard({ product, onDelete, onEdit, price }) {
  const theme = useTheme();

  // Cálculos de precios
  const priceKiloUsd =
    product.weight > 0 ? (product.price / product.weight).toFixed(2) : "N/A";

  return (
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
            {product.brand} - {product.store}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">Peso:</Typography>
          <Typography>{product.weight || "N/A"}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">Precio ($):</Typography>
          <Typography>${product.price || "N/A"}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">Precio kilo ($):</Typography>
          <Typography>{priceKiloUsd}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">Fecha:</Typography>
          <Typography>
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
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Tooltip title="Visitar enlace" arrow>
            <IconButton
              color="primary"
              component="a"
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Link />
            </IconButton>
          </Tooltip>
          <Box>
            <Tooltip title="Eliminar producto" arrow>
              <IconButton onClick={() => onDelete(product)}>
                <Delete color="error" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar producto" arrow>
              <IconButton onClick={() => onEdit(product)}>
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}