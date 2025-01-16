import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import API from "../services/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      console.log("Signup successful:", response.data);
      alert("Signup successful!");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <motion.div
        className="w-full max-w-md p-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-center text-gray-800">GuidEd</h1>
        <p className="text-center text-black mt-2">
          Sign Up Now and Unlock the Path to Your Goals
        </p>
        <hr className="bg-black h-[1px] border-0  my-2" />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-4 py-4" onSubmit={handleSubmit}>
          <div className="flex items-center bg-gray-100 border border-black rounded-xl px-4 py-2">
            <FaUser className="text-black mr-3" />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="bg-transparent  w-full focus:outline-none text-gray-800"
            />
          </div>
          <div className="flex items-center bg-gray-100 border border-black rounded-xl px-4 py-2">
            <FaUser className="text-black mr-3" />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-gray-600"
            />
          </div>
          <div className="flex items-center bg-gray-100 border border-black rounded-xl px-4 py-2">
            <FaEnvelope className="text-black mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-gray-600"
            />
          </div>
          <div className="flex items-center bg-gray-100 border border-black rounded-xl px-4 py-2">
            <FaLock className="text-black mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-gray-600"
            />
          </div>
          <div className="flex items-center bg-gray-100 border border-black text-black rounded-xl px-4 py-2">
            <FaLock className="text-black mr-3" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-black"
            />
          </div>
          <motion.button
            type="submit"
            className="w-32 bg-gray-100 border border-black text-black py-2 px-4  rounded-xl mx-auto block hover:bg-slate-200 focus:outline-none "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
