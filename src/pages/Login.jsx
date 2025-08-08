import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api";
import { AuthContext } from "../AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      login(res.data.token, res.data.user);
      alert("Login successful!");
      setFormData({ emailOrPhone: "", password: "" });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://socialvibebackend-5.onrender.com/api/auth/google";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-screen absolute top-0 left-0">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-pink-600 text-white flex-col justify-center items-center p-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to</h1>
        <h1 className="font-extrabold text-5xl tracking-tight italic text-white animate-bounce">SOCIALVIBE</h1>
        <p className="mt-4 text-lg text-pink-100 text-center max-w-md">
          Connect, share, and vibe with your community. Your social world,
          reimagined.
        </p>
      </div>

      {/* Right side - Login */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 bg-white ">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-2">
            Login to <span className="font-extrabold text-2xl tracking-tight italic text-pink-600 animate-pulse">SOCIALVIBE</span> 
          </h2>
          {error && <div className="text-red-500 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">
                Email or Phone
              </label>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lgfocus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition-all font-semibold"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between text-sm text-gray-600 ">
            <Link
              to="/Forgot"
              className="hover:underline text-pink-500"
            >
              Forgot password?
            </Link>
            <Link to="/register" className="hover:underline text-pink-500">
              Create account
            </Link>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-500">
              or
            </span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
