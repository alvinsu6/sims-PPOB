import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./register/register";
import LoginForm from "./login/login";
import TopUp from "./topup/topup";
import Home from "./Homepage/Home";
import Profile from "./akun/akun";
import PaymentPage from "./pembelian/pembayaran";
import RiwayatTransaksi from "./riwayat transaksi/history";
import ProtectedRoute from "./login/auth"; // Import komponen ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk halaman registrasi */}
        <Route path="/register" element={<RegistrationForm />} />

        {/* Route untuk halaman login */}
        <Route path="/" element={<LoginForm />} />

        {/* Route yang dilindungi */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/akun"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:serviceName"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <RiwayatTransaksi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topup"
          element={
            <ProtectedRoute>
              <TopUp />
            </ProtectedRoute>
          }
        />

        {/* Route default (redirect ke login jika tidak ada path yang cocok) */}
        <Route path="*" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
