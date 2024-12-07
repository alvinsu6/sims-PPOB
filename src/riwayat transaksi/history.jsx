import React, { useState, useEffect } from "react";
import "./transactionHistory.css";
import CardBackground from "../assets/saldo.png"; // Ganti path sesuai lokasi file gambar Anda
import { Link } from "react-router-dom";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [user, setUser] = useState(null);

  const limit = 5; // Jumlah transaksi per halaman

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Token tidak ditemukan.");
      return;
    }

    const fetchUserData = async () => {
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
        alert("Gagal memuat data pengguna.");
      }
    };

    const fetchBalance = async () => {
      try {
        const response = await fetch("https://take-home-test-api.nutech-integrasi.com/balance", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === 0) {
          setBalance(data.data.balance);
        }
      } catch (error) {
        console.error("Kesalahan jaringan:", error);
        alert("Gagal memuat saldo.");
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${offset}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.status === 0) {
          setTransactions((prev) => [...prev, ...data.data.records]);
        }
      } catch (error) {
        console.error("Kesalahan jaringan:", error);
        alert("Gagal memuat riwayat transaksi.");
      }
    };

    fetchUserData();
    fetchBalance();
    fetchTransactions();
  }, [offset]);

  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <div className="transaction-history-container">
      {/* Header */}
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

      {/* User Info */}
      <div className="header">
        <div className="user-info">
          <img
            src={user?.profile_image || "https://via.placeholder.com/100"}
            alt="User"
            className="user-avatar"
          />
          <div>
            <h2>Selamat datang,</h2>
            <h3>{user ? `${user.first_name} ${user.last_name}` : "Loading..."}</h3>
          </div>
        </div>
      </div>

      {/* Kartu Saldo */}
      <div
        className="balance-card"
        style={{ backgroundImage: `url(${CardBackground})` }}
      >
        <p>Saldo Anda:</p>
        <h2>
          {isBalanceVisible
            ? `Rp ${balance ? balance.toLocaleString() : "0"}`
            : "****"}
        </h2>
        <button className="toggle-balance-button" onClick={toggleBalanceVisibility}>
          {isBalanceVisible ? "Sembunyikan Saldo" : "Lihat Saldo"}
        </button>
      </div>

      {/* Daftar Riwayat Transaksi */}
      <div className="transactions">
        <h3>Riwayat Transaksi</h3>
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-item">
            {/* Jumlah Transaksi */}
            <p
              className={`amount ${
                transaction.transaction_type === "PAYMENT" ? "negative" : "positive"
              }`}
            >
              {transaction.transaction_type === "PAYMENT" ? "-" : "+"} Rp{" "}
              {transaction.total_amount.toLocaleString()}
            </p>
            {/* Informasi Layanan */}
            <p className="service">
              {transaction.description || "Tidak Diketahui"}
            </p>
            {/* Tanggal Transaksi */}
            <p className="date">
              {new Date(transaction.created_on).toLocaleDateString()}
            </p>
          </div>
        ))}
        {transactions.length === 0 && <p>Belum ada riwayat transaksi.</p>}
      </div>

      {/* Tombol Show More */}
      <button className="show-more-button" onClick={handleShowMore}>
        Tampilkan Lebih Banyak
      </button>
    </div>
  );
}

export default TransactionHistory;
