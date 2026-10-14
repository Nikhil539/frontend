// src/pages/Products.jsx

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getAllProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h2 className="loading-message">Loading products...</h2>;
  }

  if (error) {
    return (
      <section className="catalog-page">
        <p className="section-eyebrow">THE COLLECTION</p>
        <h1>Thoughtful finds for everyday living.</h1>
        <h2 className="error-message">{error}</h2>
      </section>
    );
  }

  return (
    <section className="catalog-page">
      <div className="catalog-heading">
        <div>
          <p className="section-eyebrow">THE COLLECTION</p>
          <h1>Thoughtful finds for everyday living.</h1>
        </div>
        <p className="catalog-caption">A few good things, chosen for you.</p>
      </div>

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-cart">
          <h2>No products just yet</h2>
          <p>Please check back soon for new arrivals.</p>
        </div>
      )}
    </section>
  );
}

export default Products;
