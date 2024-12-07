import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GambarLogin from '../assets/regist.png';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Periksa apakah pengguna sudah login
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/login",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === 0) {
        setMessage(result.message || "Login berhasil! Selamat datang.");

        // Menangkap token dari `result.data.token`
        const token = result.data?.token;
        if (token) {
          localStorage.setItem("authToken", token);
          console.log("Token berhasil disimpan di localStorage:", token);

          // Arahkan ke halaman transaksi setelah login berhasil
          navigate("/transaction-history");
        } else {
          console.log("Token tidak ditemukan dalam respons.");
        }
      } else {
        setMessage(result.message || "Login gagal.");
      }
    } catch (error) {
      console.error("Kesalahan saat mengirim permintaan:", error);
      setMessage("Gagal terhubung ke server. Coba lagi nanti.");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#fcefee" }}>
      {/* Left Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 50px",
        }}
      >
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <h1
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            SIMS PPOB
          </h1>
          <h2
            style={{
              fontSize: "18px",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Masuk ke akun Anda
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#ff3b3b",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
          {message && (
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: message.includes("berhasil") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Belum punya akun?{" "}
            <a href="/register" style={{ color: "#ff3b3b", textDecoration: "none" }}>
              daftar di sini
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fdecec",
        }}
      >
        <img
          src={GambarLogin}
          alt="Illustration"
          style={{ maxWidth: "90%", height: "auto" }}
        />
      </div>
    </div>
  );
}

export default LoginForm;
