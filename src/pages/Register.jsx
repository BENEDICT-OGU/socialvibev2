import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    avatar: "",
    acceptedTerms: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.acceptedTerms) {
      setError("You must accept the terms and conditions to register.");
      return;
    }

    try {
      await axiosInstance.post("/auth/register", formData);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-white absolute top-0 left-0">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-pink-600 text-white p-10 sticky left-0 ">
        <h1 className="text-5xl font-extrabold tracking-tight italic mb-2 animate-bounce ">SOCIALVIBE</h1>
        <p className="text-lg text-center max-w-sm">
          Create your account and start vibing with the community.
        </p>
      </div>

      {/* Right Panel - Registration */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-10 overflow-auto">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center text-pink-600">
            Create Your <span className="italic font-extrabold  animate-pulse">SOCIALVIBE</span> Account
          </h2>

          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          {success && <div className="text-green-500 text-center text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-2">
            {["name", "email", "phone", "password"].map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            ))}

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="acceptedTerms"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                required
                className="h-4 w-4 text-pink-500"
              />
              <label htmlFor="acceptedTerms" className="text-sm text-gray-600">
                I accept the{" "}
                <a href="/TC" className="text-pink-500 hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Register
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 hover:underline">
              Login
            </Link>
          </div>

          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
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

export default Register;
