import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const response = await fetch(
                    `http://localhost:8080/api/products/${id}`
                );

                if (!response.ok) {
                    throw new Error("Product not found");
                }

                const data = await response.json();

                setProduct(data);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }
        };

        fetchProduct();

    }, [id]);

    if (loading) {
        return <h2 className="loading-message">Loading product...</h2>;
    }

    if (error) {
        return <h2 className="error-message">{error}</h2>;
    }

    return (
        <div className="product-details">
            <div className="product-details-image">
                <img src={product.imageUrl} alt={product.name} />
            </div>

            <div className="product-details-copy">
                <p className="product-category">{product.category}</p>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p className="product-detail-price">₹{product.price}</p>
                <p>⭐ {product.rating}</p>
                <p>Available stock: {product.stock}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
        </div>
    );
}

export default ProductDetails;