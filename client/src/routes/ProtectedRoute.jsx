import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth);

  if (!user.isAuthenticated || !user.user) {
    return <Navigate to="/login" replace />;
  }

  let hasAccess =
    user?.user?.roles?.some((role) => allowedRoles.includes(role)) || false;

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
