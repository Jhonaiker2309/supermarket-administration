import React, { createContext, useState, useContext, useEffect } from 'react';

// Obtén la URL base de la API desde la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [dolarOptions, setDolarOptions] = useState([]);

  // ===========================
  // Funciones para Products
  // ===========================

  // Función para cargar los productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  // Función para agregar un producto
  const addProduct = async (product) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        `${API_URL}/products/${updatedProduct.name}/${updatedProduct.brand}/${updatedProduct.store}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
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
        `${API_URL}/products/${productToDelete.name}/${productToDelete.brand}/${productToDelete.store}`,
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

  // ===========================
  // Funciones para Dolar
  // ===========================

  // Función para cargar los valores del dólar desde el backend
  const fetchDolarOptions = async () => {
    try {
      const response = await fetch(`${API_URL}/dolar`);
      if (!response.ok) {
        throw new Error('Error al cargar los valores del dólar');
      }
      const data = await response.json();
      setDolarOptions(data);
    } catch (error) {
      console.error('Error al cargar los valores del dólar:', error);
    }
  };

  // Función para agregar un nuevo valor del dólar
  const addDolar = async (dolar) => {
    try {
      const response = await fetch(`${API_URL}/dolar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dolar),
      });
      if (!response.ok) {
        throw new Error('Error al agregar el valor del dólar');
      }
      const newDolar = await response.json();
      setDolarOptions((prev) => [...prev, newDolar]);
    } catch (error) {
      console.error('Error al agregar el valor del dólar:', error);
    }
  };

  // Función para actualizar un valor del dólar
  const updateDolar = async (updatedDolar) => {
    try {
      const response = await fetch(`${API_URL}/dolar/${updatedDolar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDolar),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el valor del dólar');
      }
      const updated = await response.json();
      setDolarOptions((prev) =>
        prev.map((dolar) => (dolar.id === updated.id ? updated : dolar))
      );
    } catch (error) {
      console.error('Error al actualizar el valor del dólar:', error);
    }
  };

  // Función para eliminar un valor del dólar
  const deleteDolar = async (dolarId) => {
    try {
      const response = await fetch(`${API_URL}/dolar/${dolarId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el valor del dólar');
      }
      setDolarOptions((prev) => prev.filter((dolar) => dolar.id !== dolarId));
    } catch (error) {
      console.error('Error al eliminar el valor del dólar:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDolarOptions();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        dolarOptions,
        addDolar,
        updateDolar,
        deleteDolar,
      }}
    >
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