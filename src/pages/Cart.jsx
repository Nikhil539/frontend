
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  async function handlePlaceOrder() {
    setLoading(true);
    setError("");

    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const order = await createOrder(items);

      // Clear the cart only after the backend confirms success.
      cart.forEach((item) => removeFromCart(item.id));

      setPlacedOrder(order);
    } catch (err) {
      setError(err.message || "Unable to place your order.");
    } finally {
      setLoading(false);
    }
  }

  // Show confirmation before checking whether the cart is empty.
  if (placedOrder) {
    return (
      <section className="cart-page">
        <div className="empty-cart">
          <h1>Order placed successfully!</h1>
          <p>
            Order ID: {placedOrder.id}
          </p>
          <p>
            Total: ₹
            {Number(placedOrder.totalAmount).toFixed(2)}
          </p>
          <p>Status: {placedOrder.status}</p>

          <Link className="continue-shopping" to="/orders">
            View My Orders
          </Link>

          <p>
            <Link to="/">Continue shopping</Link>
          </p>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <div className="empty-cart">
          <h1>Your cart is empty</h1>
          <p>Find something you love and add it to your cart.</p>
          <Link className="continue-shopping" to="/">
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />

              <div>
                <h2>{item.name}</h2>
                <p className="cart-item-price">₹{item.price}</p>

                <div className="cart-item-actions">
                  <div
                    className="quantity-control"
                    aria-label={`Quantity: ${item.quantity}`}
                  >
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={loading}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => increaseQuantity(item.id)}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>

          <div className="cart-summary-total">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}

          <button
            className="continue-shopping"
            onClick={handlePlaceOrder}
            disabled={loading || cart.length === 0}
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>

          <p>
            <Link to="/">Continue shopping</Link>
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
