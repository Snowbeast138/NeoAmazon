import React, { useState, useEffect } from "react";
import apiClient from "../services/api";
import type { IProduct } from "../types/interfaces";

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get<IProduct[]>("/products");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.price} - {product.description} -
            {product.category} - {product.stock}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductListPage;
