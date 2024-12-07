import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css"; // CSS untuk styling
import CardBackground from "../assets/saldo.png"; // Tambahkan gambar untuk background saldo
import DefaultAvatar from "../assets/regist.png"; // Gambar default untuk avatar

function HomePage() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [services, setServices] = useState([]);
  const [banners, setBanners] = useState([]); // State untuk data banner
  const [isLoading, setIsLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true); // State untuk kontrol visibilitas saldo

  useEffect(() => {
    const fetchApi = async (url) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token tidak ditemukan");
        return null;
      }
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === 0) {
          return data.data;
        } else {
          console.error(`Gagal memuat data dari ${url}:`, data.message);
          return null;
        }
      } catch (error) {
        console.error(`Kesalahan fetch dari ${url}:`, error);
        return null;
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      const userData = await fetchApi(
        "https://take-home-test-api.nutech-integrasi.com/profile"
      );
      const balanceData = await fetchApi(
        "https://take-home-test-api.nutech-integrasi.com/balance"
      );
      const serviceData = await fetchApi(
        "https://take-home-test-api.nutech-integrasi.com/services"
      );
      const bannerData = await fetchApi(
        "https://take-home-test-api.nutech-integrasi.com/banner"
      );

      if (userData) setUser(userData);
      if (balanceData) setBalance(balanceData.balance);
      if (serviceData) setServices(serviceData);
      if (bannerData) setBanners(bannerData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <div className="homepage-container">
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
      <section className="homepage-user-info">
        <div className="user-details">
          {/* Tampilkan gambar default jika user belum punya profile_image */}
          <img
            src={user && user.profile_image ? user.profile_image : DefaultAvatar}
            alt="User"
            className="user-avatar"
          />
          <h2>Selamat datang,</h2>
          <h3>{user ? `${user.first_name} ${user.last_name}` : "Loading..."}</h3>
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
          <button
            className="toggle-balance-button"
            onClick={toggleBalanceVisibility}
          >
            {isBalanceVisible ? "Sembunyikan Saldo" : "Lihat Saldo"}
          </button>
        </div>
      </section>

      {/* Layanan */}
      <section className="homepage-services">
        <h2>Layanan Tersedia</h2>
        <div className="service-grid">
          {services.length > 0 ? (
            services.map((service, index) => (
              <Link
                to={`/payment/${service.service_name}`}
                key={index}
                className="service-card"
              >
                <img
                  src={service.service_icon}
                  alt={service.service_name}
                  className="service-icon"
                />
                <h3>{service.service_name}</h3>
                <p>Tarif: Rp {service.service_tariff.toLocaleString()}</p>
              </Link>
            ))
          ) : (
            <p>Loading services... atau layanan tidak tersedia</p>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="homepage-promos">
        <h2>Banner Promo</h2>
        <div className="banner-grid">
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div key={index} className="banner-card">
                <img
                  src={banner.banner_image}
                  alt={banner.banner_name}
                  className="banner-image"
                />
                <div className="banner-info">
                  <h3>{banner.banner_name}</h3>
                  <p>{banner.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading banners... atau banner tidak tersedia</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
