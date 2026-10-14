
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cancelOrder, getMyOrders } from "../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function handleCancel(orderId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    setCancellingId(orderId);
    setError("");

    try {
      const updatedOrder = await cancelOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (err) {
      setError(err.message || "Failed to cancel the order.");
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return <section className="orders-page"><p>Loading your orders...</p></section>;
  }

  return (
    <section className="orders-page">
      <h1>My Orders</h1>

      {error && <p role="alert" className="error-message">{error}</p>}

      <button onClick={loadOrders} disabled={cancellingId !== null}>
        Refresh Orders
      </button>

      {orders.length === 0 ? (
        <div>
          <h2>No orders yet</h2>
          <p>Your orders will appear here after checkout.</p>
          <Link to="/">Start shopping</Link>
        </div>
      ) : (
        orders.map((order) => (
          <article className="order-card" key={order.id}>
            <h2>Order #{order.id}</h2>

            <p>
              Status: <strong>{order.status}</strong>
            </p>

            <p>
              Date:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "Not available"}
            </p>

            <div>
              <h3>Items</h3>
              {order.items?.map((item, index) => (
                <div key={`${item.productId}-${index}`}>
                  <span>{item.productName || item.name || item.productId}</span>
                  {" — "}
                  <span>Qty: {item.quantity}</span>
                  {" — "}
                  <span>
                    ₹{Number(item.price ?? item.unitPrice ?? 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <p>
              <strong>
                Total: ₹{Number(order.totalAmount ?? 0).toFixed(2)}
              </strong>
            </p>

            {order.status === "PLACED" && (
              <button
                onClick={() => handleCancel(order.id)}
                disabled={cancellingId !== null}
              >
                {cancellingId === order.id
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>
            )}
          </article>
        ))
      )}
    </section>
  );
}

export default Orders;
