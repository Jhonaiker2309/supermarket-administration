import React from 'react';
import ProductModal from './ProductModal';
import { useProductContext } from '../context/ProductContext';

export default function EditProductModal({ open, onClose, product }) {
  const { updateProduct } = useProductContext();

  const handleSave = (updatedProduct) => {
    updateProduct(updatedProduct);
    onClose();
  };

  return (
    <ProductModal open={open} onClose={onClose} onSave={handleSave} product={product} />
  );
}