import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaDollarSign,
  FaShieldAlt,
  FaRocket
} from "react-icons/fa";

import { loginSchema, type LoginFormData } from "@/validations/auth.validation";
import { authService } from "@/services/auth.service";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg("");

    try {
      const res = await authService.login(data);
      login(res.data.data);

      // Smooth transition to dashboard
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Login failed");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const rightPanelVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* ================= LEFT : LOGIN FORM ================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-8"
      >
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-8 w-full max-w-md hover:shadow-2xl transition-shadow duration-300"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white flex items-center justify-center shadow-lg shadow-blue-200">
              <FaUsers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                AffiliateMS
              </div>
              <div className="text-xs text-gray-500 tracking-wide">
                Affiliate Marketing Platform
              </div>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-500 mb-8"
          >
            Sign in to manage your affiliate campaigns
          </motion.p>

          {/* Email Field */}
          <motion.div variants={itemVariants} className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">
              Email Address
            </label>
            <div
              className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${
                focusedField === "email"
                  ? "border-blue-400 ring-4 ring-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FaEnvelope
                className={`w-4 h-4 mr-3 transition-colors ${
                  focusedField === "email" ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                {...register("email")}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
                placeholder="affiliate@company.com"
                autoComplete="username"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-500 ml-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">
              Password
            </label>
            <div
              className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${
                focusedField === "password"
                  ? "border-blue-400 ring-4 ring-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FaLock
                className={`w-4 h-4 mr-3 transition-colors ${
                  focusedField === "password" ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <input
                type="password"
                {...register("password")}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-500 ml-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Forgot Password & Options */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-6"
          >
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="group-hover:text-gray-800 transition-colors">
                Remember me
              </span>
            </label>
            <motion.button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Forgot password?
              <FaArrowRight className="w-3 h-3" />
            </motion.button>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </motion.div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign in to Dashboard
                <FaArrowRight className="w-4 h-4" />
              </span>
            )}
          </motion.button>

          {/* Error Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-5 p-3 bg-red-50 border border-red-100 rounded-xl"
              >
                <p className="text-red-600 text-sm text-center">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Register Link */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center text-sm text-gray-600"
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
            >
              Create one now
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center text-xs text-gray-400"
          >
            <span>Secure affiliate login • </span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">
              Need help?
            </span>
          </motion.div>
        </motion.form>
      </motion.div>

      {/* ================= RIGHT : HERO SECTION ================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={rightPanelVariants}
        className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"
        />

        {/* Content */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-8 flex items-center justify-center"
          >
            <FaHandshake className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-4xl font-bold mb-4 leading-tight"
          >
            Grow Your
            <br />
            Affiliate Empire
          </motion.h2>

          <motion.p
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-blue-100 mb-10 leading-relaxed text-lg"
          >
            A comprehensive platform to manage referrals, track commissions,
            process payouts, and scale your affiliate marketing business.
          </motion.p>

          {/* Feature List */}
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {[
              "Real-time Referral Tracking",
              "Automated Commission Calculations",
              "Secure Payout Management",
              "Advanced Analytics & Reports",
              "Role-based Access Control",
            ].map((feature, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3 text-white/90"
              >
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex-shrink-0 w-6 h-6 bg-green-400/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <FaCheckCircle className="w-4 h-4 text-green-300" />
                </motion.span>
                <span className="text-sm">{feature}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4"
          >
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" },
              { value: "10K+", label: "Affiliates" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12 text-xs text-blue-200/80"
          >
            © 2026 AffiliateMS. All rights reserved.
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;