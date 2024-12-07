import React, { useState, useEffect } from "react";
import "./account.css";
import { Link } from "react-router-dom";

function AccountPage() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "https://via.placeholder.com/150",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          "https://take-home-test-api.nutech-integrasi.com/profile",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok && result.status === 0) {
          setUser({
            firstName: result.data.first_name,
            lastName: result.data.last_name,
            email: result.data.email,
            profileImage: result.data.profile_image,
          });
        } else {
          alert(`Gagal mendapatkan data profil: ${result.message}`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Terjadi kesalahan saat mengambil data profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/profile/image",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.status === 0) {
        alert(result.message);
        setUser((prevUser) => ({
          ...prevUser,
          profileImage: result.data.profile_image,
        }));
      } else {
        alert(`Gagal mengupload foto profil: ${result.message}`);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Terjadi kesalahan saat mengupload foto profil.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/profile/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            first_name: user.firstName,
            last_name: user.lastName,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === 0) {
        alert(result.message);
        setUser((prevUser) => ({
          ...prevUser,
          firstName: result.data.first_name,
          lastName: result.data.last_name,
        }));
        setIsEditing(false);
      } else {
        alert(`Gagal menyimpan perubahan: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan saat menyimpan perubahan profil.");
    }
  };

  const handleLogout = () => {
    // Hapus token dan data dari localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData"); // Jika ada data lain yang disimpan

    // Redirect ke halaman utama
    window.location.href = "/";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-container">
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

      <div className="account-content">
        <div className="profile-section">
          <div className="profile-avatar">
            <img src={user.profileImage} alt="Profile" className="profile-image" />
            {/* Ikon edit */}
            <label htmlFor="profileImageInput" className="edit-icon">
              <img
                src="/assets/edit-icon.png" // Pastikan file ada di folder public/assets
                alt="Edit"
                className="edit-icon-image"
              />
            </label>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <h2>{`${user.firstName} ${user.lastName}`}</h2>
        </div>

        <div className="profile-form">
          <label>Email</label>
          <input type="email" value={user.email} readOnly />

          <label>Nama Depan</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <label>Nama Belakang</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          {isEditing ? (
            <button className="save-button" onClick={handleSaveProfile}>
              Simpan Perubahan
            </button>
          ) : (
            <button className="edit-button" onClick={handleEditToggle}>
              Edit Profil
            </button>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
