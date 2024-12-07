import React, { useState, useEffect } from "react";
import "./Topup.css"; // Pastikan file CSS dibuat terpisah
import { Link } from "react-router-dom";
import saldoImage from '../assets/saldo.png'
function TopUp() {
  const [userData, setUserData] = useState({});
  const [balance, setBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State untuk kontrol modal
  const [selectedAmount, setSelectedAmount] = useState(null); // State untuk amount yang dipilih
  const token = localStorage.getItem("authToken");

  const fetchUserData = async () => {
    if (!token) {
      setMessage("Token tidak tersedia. Silakan login kembali.");
      return;
    }

    try {
      const userResponse = await fetch("https://take-home-test-api.nutech-integrasi.com/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userResult = await userResponse.json();
      if (userResponse.ok) {
        setUserData(userResult.data);
      } else {
        setMessage("Gagal mendapatkan data pengguna.");
      }

      const balanceResponse = await fetch("https://take-home-test-api.nutech-integrasi.com/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const balanceResult = await balanceResponse.json();
      if (balanceResponse.ok) {
        setBalance(balanceResult.data.balance || 0);
      } else {
        setMessage("Gagal mendapatkan saldo.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat mengambil data.");
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();

    if (!topUpAmount || topUpAmount <= 0) {
      setMessage("Nominal top up harus lebih dari 0.");
      return;
    }

    setShowModal(true); // Tampilkan modal konfirmasi
  };

  const confirmTopUp = async () => {
    setShowModal(false); // Menutup modal setelah konfirmasi

    try {
      const response = await fetch("https://take-home-test-api.nutech-integrasi.com/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ top_up_amount: parseInt(topUpAmount) }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Top-up berhasil!");
        fetchUserData();
        setTopUpAmount("");
      } else {
        setMessage(result.message || "Top-up gagal. Silakan coba lagi.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat top-up.");
    }
  };

  const cancelTopUp = () => {
    setShowModal(false); // Menutup modal jika dibatalkan
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="topup-container">
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

      <div className="topup-content">
        <section className="user-info">
          <img
            src={userData.profile_image || "https://via.placeholder.com/100"}
            alt="Profile"
            className="profile-image"
          />
          <h2>Selamat datang,</h2>
          <h3>{userData.first_name ? `${userData.first_name} ${userData.last_name}` : "Pengguna"}</h3>
        </section>

        <div  style={{ backgroundImage: `url(${saldoImage})` }}
        className="balance-card">
          <h3>Saldo Anda</h3>
          <p>Rp {balance.toLocaleString()}</p>
        </div>

        <section className="topup-form">
          <h2>Silakan masukkan</h2>
          <h3>Nominal Top Up</h3>
          <form onSubmit={handleTopUp}>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Masukkan nominal"
              className="input-amount"
            />
            <div className="quick-buttons">
              {[10000, 20000, 50000, 100000, 250000, 500000].map((amount) => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => setTopUpAmount(amount)}
                  className="quick-button"
                >
                  Rp {amount.toLocaleString()}
                </button>
              ))}
            </div>
            <button type="submit" className="submit-button">Top Up</button>
          </form>
          {message && <p className={`message ${message.includes("berhasil") ? "success" : "error"}`}>{message}</p>}
        </section>
      </div>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Konfirmasi Top Up</h3>
            <p>Apakah Anda yakin ingin melakukan top-up sebesar Rp {topUpAmount.toLocaleString()}?</p>
            <div className="modal-actions">
              <button onClick={confirmTopUp} className="confirm-btn">Ya, Top Up</button>
              <button onClick={cancelTopUp} className="cancel-btn">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopUp;
