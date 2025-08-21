import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth";
import { toast } from "react-hot-toast";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { storeTokenInLS, API } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();
      if (response.ok) {
        toast.success(`Welcome Back`);
        storeTokenInLS(res_data.token);
        setUser({ email: "", password: "" });
        navigate(`/dashboard`);
      } else {
        toast.error(res_data.extraDetails || res_data.message || res_data.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main 
      className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-8"
      style={{ overflow: 'hidden' }} // Prevents scrollbar during animation
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Login Form */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-8">
          {/* Header Section - Moved Inside Container */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/logo.png"
                alt="BookMyLook"
                className="h-16 w-auto mx-auto hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
                style={{
                  filter: "drop-shadow(0 0 2rem rgba(139, 92, 246, 0.4))",
                }}
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={handleInput}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={handleInput}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-300 focus:outline-none transition-colors duration-300 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <NavLink
              to="/forgot-password"
              className="group inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Forgot Password ?
            </NavLink>
          </div>

          {/* Divider */}
          <div className="mt-4 mb-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800/50 text-gray-400">
                  New here?
                </span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <NavLink
              to="/register/user"
              className="group inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Create an account
              <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </NavLink>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
