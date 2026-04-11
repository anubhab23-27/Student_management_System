import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  if (!user) {
    return <Navigate to="/" />;
  }

  // role-based protection
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
