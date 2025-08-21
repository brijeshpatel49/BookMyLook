import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Added import
import { useAuth } from "../store/auth";
import { toast } from "react-hot-toast";
import { OTPVerify } from "../components/OTPVerify";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const Register = () => {
  const { role } = useParams();
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: role || "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");

  const navigate = useNavigate();
  const { storeTokenInLS, API } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Step 1: Send OTP for registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/send-registration-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();
      if (response.ok) {
        toast.success("Verification code sent to your email!");
        setRegistrationEmail(user.email);
        setShowOTPVerification(true);
      } else {
        toast.error(res_data.extraDetails || res_data.message);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle successful OTP verification
  const handleVerificationSuccess = (data) => {
    storeTokenInLS(data.token);
    toast.success("Registration successful! Welcome to BookMyLook!");
    navigate("/dashboard");
  };

  // Handle back to registration
  const handleBackToRegistration = () => {
    setShowOTPVerification(false);
    setRegistrationEmail("");
  };

  const isBarber = role === "barber";
  const toggleLabel = isBarber ? "Register as User" : "Register as Barber";
  const togglePath = isBarber ? "/register/user" : "/register/barber";

  // Show OTP verification screen if email is sent
  if (showOTPVerification) {
    return (
      <OTPVerify
        email={registrationEmail}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackToRegistration}
      />
    );
  }

  // Registration Form Screen - Simple come in animation
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-4 "style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-6">
          {/* Toggle Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate(togglePath)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <ArrowPathIcon className="h-4 w-4" />
              {toggleLabel}
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <img
              src="/logo.png"
              alt="BookMyLook"
              className="h-15 w-auto mx-auto hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 0 2rem rgba(139, 92, 246, 0.4))",
              }}
            />
            <h2 className="text-2xl font-bold text-white mb-2">
              Register as {isBarber ? "Barber" : "User"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-300 mb-1 block"
              >
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={user.username}
                  onChange={handleInput}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 mb-1 block"
              >
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={user.email}
                  onChange={handleInput}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-300 mb-1 block"
              >
                Phone
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone"
                  value={user.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleInput({ target: { name: 'phone', value } });
                  }}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 mb-1 block"
              >
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={user.password}
                  onChange={handleInput}
                  required
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <input type="hidden" name="role" value={user.role} />

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:scale-105 disabled:transform-none transition-all duration-300 cursor-pointer"
            >
              {loading ? "Sending Verification Code..." : "Register Now"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Login here
            </NavLink>
          </p>
        </div>
      </motion.div>
    </main>
  );
};
