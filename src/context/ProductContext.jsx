import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  // Función para cargar los productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products'); // Llama al endpoint del backend
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      setProducts(data); // Actualiza el estado con los productos obtenidos
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  // Función para agregar un producto
  const addProduct = async (product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Se envía el objeto product que incluye el array "images"
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error('Error al agregar el producto');
      }
      const newProduct = await response.json();
      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  // Función para actualizar un producto
  const updateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(
        `/api/products/${updatedProduct.name}/${updatedProduct.brand}/${updatedProduct.store}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          // Se envía updatedProduct, que incluye el nuevo array de imágenes si corresponde
          body: JSON.stringify(updatedProduct),
        }
      );
      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }
      const updated = await response.json();
      setProducts((prev) =>
        prev.map((product) =>
          product.name === updated.name &&
          product.brand === updated.brand &&
          product.store === updated.store
            ? updated
            : product
        )
      );
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  // Función para eliminar un producto
  const deleteProduct = async (productToDelete) => {
    try {
      const response = await fetch(
        `/api/products/${productToDelete.name}/${productToDelete.brand}/${productToDelete.store}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
      setProducts((prev) =>
        prev.filter(
          (product) =>
            !(
              product.name === productToDelete.name &&
              product.brand === productToDelete.brand &&
              product.store === productToDelete.store
            )
        )
      );
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}