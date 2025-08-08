import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message || "Password reset email sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow min-h-[300px] flex flex-col justify-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">Forgot Password</h2>
      {message && <div className="mb-4 text-green-500 text-center">{message}</div>}
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Remembered your password?{" "}
        <Link to="/login" className="text-pink-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
