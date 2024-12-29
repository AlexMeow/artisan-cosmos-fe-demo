import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if token is expired
        if (decodedToken.exp < currentTime) {
          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
          });
          localStorage.removeItem("jwt");
          navigate("/login");
        }

        navigate(`/artist/${jwtDecode(localStorage.getItem("jwt")).id}`);
      } catch (error) {
        console.error("Invalid token:", error);
        Swal.fire({
          icon: "warning",
          title: "Invalid Token",
          text: "Invalid token detected. Please log in again.",
        });
        localStorage.removeItem("jwt");
        navigate("/login");
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please log in first!",
      });
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <Footer />
    </div>
  );
};

export default ProfilePage;