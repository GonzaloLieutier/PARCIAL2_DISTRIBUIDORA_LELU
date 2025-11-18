
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isLogged, hasRole } = useAuth();

  if (!isLogged) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
