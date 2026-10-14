import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {

    const { user } = useAuth();

    // User is not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User is logged in but doesn't have required role
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/products" replace />;
    }

    // User is authenticated and authorized
    return children;
}

export default ProtectedRoute;