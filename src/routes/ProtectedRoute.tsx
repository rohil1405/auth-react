import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdminRoute?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAdminRoute = false,
}) => {
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
