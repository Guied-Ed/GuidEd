import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import API from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response.data);
      alert("Login successful!");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <motion.div
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-center text-gray-800">GuidEd</h1>
        <p className="text-center text-gray-500 mt-2">
          Welcome Back! Let's Continue Your Journey.
        </p>
        <hr className="my-4" />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-gray-600"
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-gray-600"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <a href="/forgot-password" className="text-blue-500">
              Forgot Password?
            </a>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </motion.button>
        </form>
        <p className="text-center text-sm mt-4">
          New to GuidEd?{" "}
          <a href="/signup" className="text-blue-500">
            Sign Up Here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
