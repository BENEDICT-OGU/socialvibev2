// src/pages/VerifyEmail.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }

    axios.get(`/api/auth/verify-email?token=${token}`)
      .then(res => {
        setMessage(res.data.message);
        // Auto-login after successful verification
        if (res.data.token && res.data.user) {
          login(res.data.token, res.data.user);
          navigate("/");
        } else {
          // fallback redirect to login page
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      })
      .catch(err => {
        setMessage(err.response?.data?.message || "Verification failed.");
      });
  }, [login, navigate]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default VerifyEmail;
