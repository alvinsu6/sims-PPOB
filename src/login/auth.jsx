import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  // Jika token tidak ditemukan, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika token ada, izinkan akses ke halaman anak
  return children;
};

export default ProtectedRoute;
