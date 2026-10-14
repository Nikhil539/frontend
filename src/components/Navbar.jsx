import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">Home</Link>

      <Link to="/products">Products</Link>

      <Link to="/cart">Cart ({cart.length})</Link>

      {!user && (
        <>
          <Link to="/login">Login</Link>

          <Link to="/register">Register</Link>
        </>
      )}

      {user && (
        <>
          <span>Welcome, {user.name}</span>

          {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}

          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
