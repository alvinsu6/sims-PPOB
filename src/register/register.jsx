import React, { useState } from "react";
import gambarRegistrasi from "../assets/regist.png"

function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password dan Konfirmasi Password harus sama!");
      return;
    }

    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Registrasi berhasil! Silakan login.");
      } else {
        setMessage(result.message || "Terjadi kesalahan saat registrasi.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Gagal terhubung ke server. Coba lagi nanti.");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#fcefee" }}>
      {/* Bagian Form */}
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
          <h1 style={{ fontWeight: "bold", fontSize: "24px", textAlign: "center", marginBottom: "20px" }}>
            SIMS PPOB
          </h1>
          <h2 style={{ fontSize: "18px", marginBottom: "30px", textAlign: "center" }}>
            Lengkapi data untuk membuat akun
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="masukan email anda"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="nama depan"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="nama belakang"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="buat password"
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="konfirmasi password"
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
              Registrasi
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
            sudah punya akun?{" "}
            <a href="/" style={{ color: "#ff3b3b", textDecoration: "none" }}>
              login di sini
            </a>
          </p>
        </div>
      </div>

      {/* Bagian Gambar dengan Import */}
      <div
        style={{
          flex: 1,
          backgroundImage: `url(${gambarRegistrasi})`,
          backgroundSize: "cover",  // Agar gambar mengisi lebar penuh
          backgroundPosition: "center", // Agar gambar tetap berada di tengah
          width: "50%", // Memastikan gambar memenuhi setengah lebar halaman
          height: "100vh", // Gambar memenuhi seluruh tinggi layar
        }}
      />
    </div>
  );
}

export default RegistrationForm;
