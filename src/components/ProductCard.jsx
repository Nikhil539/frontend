import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} />

        <h2>{product.name}</h2>
      </Link>

      <p>{product.description}</p>

      <h3>₹{product.price}</h3>

      <p>⭐ {product.rating}</p>

      <p>Stock: {product.stock}</p>

      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
