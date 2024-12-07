import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./payment.css"; // Gaya CSS untuk halaman pembayaran
import { Link } from "react-router-dom";

function PaymentPage() {
  const { serviceName } = useParams(); // Ambil nama layanan dari URL
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Menambahkan state untuk modal konfirmasi
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token tidak ditemukan.");
        return;
      }

      try {
        const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === 0) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Kesalahan jaringan:", error);
        alert("Kesalahan jaringan, silakan coba lagi.");
      }
    };

    const fetchBalanceData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token tidak ditemukan.");
        return;
      }

      try {
        const response = await fetch("https://take-home-test-api.nutech-integrasi.com/balance", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.status === 0 && data.data && data.data.balance !== undefined) {
          setBalance(data.data.balance);
        } else {
          alert("Gagal memuat saldo.");
        }
      } catch (error) {
        console.error("Kesalahan jaringan:", error);
        alert("Kesalahan jaringan, silakan coba lagi.");
      }
    };

    const fetchServiceDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token tidak ditemukan.");
        return;
      }

      try {
        const response = await fetch("https://take-home-test-api.nutech-integrasi.com/services", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok && data.status === 0) {
          const selectedService = data.data.find(service => service.service_name === serviceName);
          if (selectedService) {
            setServiceDetails(selectedService);
          } else {
            alert("Layanan tidak ditemukan.");
          }
        } else {
          alert("Gagal memuat data layanan.");
        }
      } catch (error) {
        console.error("Kesalahan jaringan:", error);
        alert("Kesalahan jaringan, silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchBalanceData();
    fetchServiceDetails();
  }, [serviceName]);

  const handlePayment = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Token tidak ditemukan.");
      return;
    }
  
    if (!serviceDetails) {
      alert("Data layanan tidak tersedia.");
      return;
    }
  
    try {
      const response = await fetch("https://take-home-test-api.nutech-integrasi.com/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_code: serviceDetails.service_code, // Kirim service_code yang benar
        }),
      });
      const data = await response.json();
  
      if (response.ok && data.status === 0) {
        setPaymentStatus(`Transaksi berhasil. Nomor Invoice: ${data.data.invoice_number}`);
        alert(`Transaksi berhasil. Nomor Invoice: ${data.data.invoice_number}`);
  
        // Perbarui saldo setelah pembayaran berhasil
        fetchBalanceData();
      } else {
        alert(`Gagal melakukan transaksi: ${data.message || "Kesalahan tidak diketahui."}`);
      }
    } catch (error) {
      console.error("Kesalahan pembayaran:", error);
      alert("Kesalahan pembayaran, silakan coba lagi.");
    }
  };
  
  // Fungsi untuk menutup modal konfirmasi
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  // Fungsi untuk mengonfirmasi pembayaran
  const confirmPayment = () => {
    handlePayment();
    closeConfirmationModal();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="payment-container">
      <header className="homepage-header">
        <Link to="/home">
          <h1 className="homepage-title">SIMS PPOB</h1>
        </Link>
        <nav className="homepage-nav">
          <a href="/topup">Top Up</a>
          <a href="/history">Transaction</a>
          <a href="/akun">Akun</a>
        </nav>
      </header>

      <div className="payment-header">
        <div className="payment-header-left">
          <img
            src={user ? user.profile_image : "https://via.placeholder.com/100"}
            alt="User"
            className="user-avatar"
          />
          <div className="user-info">
            <h2>Selamat datang,</h2>
            <h3>{user ? `${user.first_name} ${user.last_name}` : "Loading..."}</h3>
            <p>Saldo: Rp {balance ? balance.toLocaleString() : "0"}</p>
          </div>
        </div>
      </div>

      {/* Detail Pembayaran */}
      <div className="payment-details">
        <h1>Detail Pembayaran</h1>
        <div className="payment-item">
          <p><strong>Layanan:</strong> {serviceDetails?.service_name || "Loading..."}</p>
          <p><strong>Tarif:</strong> Rp {serviceDetails?.service_tariff ? serviceDetails.service_tariff.toLocaleString() : "0"}</p>
        </div>

        {/* Tombol Bayar */}
        <button className="pay-button" onClick={() => setShowConfirmationModal(true)}>
          Bayar
        </button>

        {/* Status Pembayaran */}
        {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
      </div>

      {/* Modal Konfirmasi Pembayaran */}
      {showConfirmationModal && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h2>Konfirmasi Pembayaran</h2>
            <p>Apakah Anda yakin ingin melakukan pembayaran?</p>
            <button onClick={confirmPayment}>Ya, Bayar</button>
            <button onClick={closeConfirmationModal}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
