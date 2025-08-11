import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    acceptedTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    if (!formData.acceptedTerms) {
      setError("You must accept the terms and conditions to register.");
      setIsLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/auth/register", formData);
      setSuccess("Registration successful! Redirecting...");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
    <div className="min-h-screen w-full flex flex-col md:flex-row  bg-gradient-to-br from-pink-50 to-white">
      {/* Left Panel - Branding with animated background */}
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
            Join
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
            Create your account and start vibing with the community.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Panel - Registration Form */}
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
              Create Account
            </motion.h2>
            <p className="text-gray-600">Join our community today</p>
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

          {success && (
            <motion.div 
              className="text-green-500 text-center p-3 bg-green-50 rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {success}
            </motion.div>
          )}

          <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
            {[
              { name: "name", icon: <FiUser className="h-5 w-5 text-gray-400" />, placeholder: "Your full name" },
              { name: "email", icon: <FiMail className="h-5 w-5 text-gray-400" />, placeholder: "your@email.com" },
              { name: "phone", icon: <FiPhone className="h-5 w-5 text-gray-400" />, placeholder: "Phone number" },
              { name: "password", icon: <FiLock className="h-5 w-5 text-gray-400" />, placeholder: "Create password", type: "password" }
            ].map((field) => (
              <motion.div key={field.name} variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {field.name}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {field.icon}
                  </div>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder={field.placeholder}
                  />
                  {field.name === "password" && (
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
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="acceptedTerms"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-pink-500 rounded focus:ring-pink-500 border-gray-300"
                />
              </div>
              <label htmlFor="acceptedTerms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/tc" className="text-pink-600 hover:underline font-medium">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/tc" className="text-pink-600 hover:underline font-medium">
                  Privacy Policy
                </a>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-pink-200 transition-all duration-300 flex justify-center items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" />
                  Register Now
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            className="relative flex items-center py-2"
            variants={itemVariants}
          >
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-500">
              or sign up with
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-600 hover:text-pink-700 font-medium hover:underline"
            >
              Sign in
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;