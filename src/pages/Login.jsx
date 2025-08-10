import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api";
import { AuthContext } from "../AuthContext";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      login(res.data.token, res.data.user);
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://socialvibebackend-5.onrender.com/api/auth/google";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-gradient-to-br from-pink-50 to-white">
      {/* Left side - Branding with animated background */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-pink-600 to-pink-500 text-white flex-col justify-center items-center p-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated floating circles */}
        <motion.div
          className="absolute top-20 left-20 w-40 h-40 rounded-full bg-pink-400 opacity-20"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-30 w-60 h-60 rounded-full bg-pink-300 opacity-15"
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-pink-200 opacity-10"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center z-10"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Welcome to
          </motion.h1>
          <motion.h1 
            className="font-extrabold text-6xl tracking-tight italic text-white mb-6"
            animate={{
              textShadow: ["0 0 8px rgba(255,255,255,0.3)", "0 0 16px rgba(255,255,255,0.5)", "0 0 8px rgba(255,255,255,0.3)"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            SOCIALVIBE
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-pink-100 text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Connect, share, and vibe with your community. Your social world, reimagined.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right side - Login Form */}
      <motion.div 
        className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center">
            <motion.h2 
              className="text-4xl font-bold text-pink-600 mb-2"
              whileHover={{ scale: 1.02 }}
            >
              Welcome Back
            </motion.h2>
            <p className="text-gray-600">Sign in to continue your social journey</p>
          </motion.div>

          {error && (
            <motion.div 
              className="text-red-500 text-center p-3 bg-red-50 rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.emailOrPhone.includes("@") ? (
                    <FiMail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Enter email or phone"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Link
                to="/forgot"
                className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-pink-200 transition-all duration-300 flex justify-center items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            className="relative flex items-center py-2"
            variants={itemVariants}
          >
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-500">
              or continue with
            </span>
            <div className="flex-grow border-t border-gray-300" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-3 transition-all"
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Google</span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="text-center text-sm text-gray-600 pt-4"
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-600 hover:text-pink-700 font-medium hover:underline"
            >
              Sign up
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;