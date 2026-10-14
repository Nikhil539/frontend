import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Orders from "./pages/Orders";

import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <header className="site-header">
        <Link className="site-title" to="/">
          My Store
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link className="nav-link" to="/">
            Shop
          </Link>

          {user && user.role !== "ADMIN" && (
            <Link className="nav-link" to="/orders">
              My Orders
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link className="nav-link" to="/admin">
              Admin
            </Link>
          )}

          <Link
            className="cart-link"
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
          >
            Cart <span className="cart-count">{cartCount}</span>
          </Link>

          {user ? (
            <>
              <span className="account-name">Hi, {user.name}</span>

              <button className="nav-button" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <Link className="login-link" to="/login">
              Log in
            </Link>
          )}
        </nav>
      </header>

      <main className="site-content">
        <Routes>
          <Route path="/" element={<Products />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
