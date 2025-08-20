// components/AuthModal.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const AuthModal = ({ isOpen, onClose, defaultTab = "login" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");

  const { storeTokenInLS, API } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const handleLoginInput = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterInput = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Login successful!");
        storeTokenInLS(data.token);
        onClose();
        window.location.reload();
      } else {
        toast.error(data.message || "Invalid Credentials");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/send-registration-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Verification code sent to your email!");
        setRegistrationEmail(registerData.email);
        setShowOTPVerification(true);
      } else {
        toast.error(data.message || "Registration failed");
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
    onClose();
    // Refresh the page to update user state and favorites
    window.location.reload();
  };

  // Handle back from OTP to registration form
  const handleBackToRegistration = () => {
    setShowOTPVerification(false);
    setRegistrationEmail("");
  };

  // Reset modal state when closing
  const handleClose = () => {
    setShowOTPVerification(false);
    setRegistrationEmail("");
    setActiveTab(defaultTab);
    setLoginData({ email: "", password: "" });
    setRegisterData({
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "user",
    });
    onClose();
  };

  if (!isOpen) return null;

  // Show OTP verification screen
  if (showOTPVerification) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 w-full max-w-sm sm:max-w-md mx-4 max-h-[95vh] overflow-y-auto">
          {/* Header - Responsive */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img
                src="/logo.png"
                alt="BookMyLook"
                className="h-6 sm:h-8 w-auto flex-shrink-0"
              />
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                Verify Your Email
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors flex-shrink-0"
            >
              <XMarkIcon className="h-4 sm:h-5 w-4 sm:w-5" />
            </button>
          </div>

          {/* OTP Verification Content - Responsive */}
          <div className="p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-gray-300 text-xs sm:text-sm mb-1 px-2">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-purple-400 font-medium text-sm sm:text-base break-all px-2">
                {registrationEmail}
              </p>
            </div>

            <OTPVerificationContent
              email={registrationEmail}
              onVerificationSuccess={handleVerificationSuccess}
              onBack={handleBackToRegistration}
              API={API}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Fixed Header - No Scroll */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BookMyLook" className="h-8 w-auto" />
            <h2 className="text-xl font-bold text-white">
              {activeTab === "login" ? "Welcome Back" : "Join BookMyLook"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Fixed Tab Navigation - No Scroll */}
        <div className="flex p-6 pb-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === "login"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700/30"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ml-2 ${
              activeTab === "register"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700/30"
            }`}
          >
            Register
          </button>
        </div>

        {/* Scrollable Content Area ONLY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          {activeTab === "login" ? (
            /* Login Form - Usually doesn't need scroll */
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-gray-300 text-sm text-center mb-6">
                Login to add favorites and book appointments
              </p>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={handleLoginInput}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginInput}
                    required
                    className="w-full pl-10 pr-12 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:scale-105 disabled:transform-none transition-all duration-300"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="mt-4 text-center">
            <NavLink
              to="/forgot-password"
              className="group inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Forgot Password ?
            </NavLink>
          </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-700/50 text-center">
                <p className="text-gray-400 text-sm">
                  Book your salon appointment today
                </p>
              </div>
            </form>
          ) : (
            /* Register Form - This will scroll */
            <form onSubmit={handleRegister} className="space-y-4">
              <p className="text-gray-300 text-sm text-center mb-6">
                Create your account to get started
              </p>

              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={handleRegisterInput}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={handleRegisterInput}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Phone
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone"
                    value={registerData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleRegisterInput({ target: { name: "phone", value } });
                    }}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={handleRegisterInput}
                    required
                    className="w-full pl-10 pr-12 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:scale-105 disabled:transform-none transition-all duration-300"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Footer */}
              <div className="mt-2 pt-2 border-t border-gray-700/50 text-center">
                <p className="text-gray-400 text-sm">
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8b5cf6, #6366f1);
          border-radius: 10px;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7c3aed, #4f46e5);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.8) rgba(75, 85, 99, 0.3);
        }
      `}</style>
    </div>
  );
};

// Extract OTP verification logic as a separate component
const OTPVerificationContent = ({
  email,
  onVerificationSuccess,
  onBack,
  API,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [codeExpiry, setCodeExpiry] = useState(600);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timers logic (same as your existing OTPVerification component)
  React.useEffect(() => {
    if (codeExpiry > 0) {
      const timer = setTimeout(() => setCodeExpiry(codeExpiry - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeExpiry]);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`modal-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`modal-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    if (codeExpiry <= 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/verify-registration-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onVerificationSuccess(data);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("New OTP sent to your email");
        setCodeExpiry(600);
        setResendTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-6">
      {/* OTP Input - Responsive */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2 justify-center sm:justify-start">
          Enter Verification Code
        </label>
        <div className="flex gap-1 sm:gap-2 justify-center px-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`modal-otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Both Timers - Responsive */}
      <div className="flex items-center justify-center gap-2 text-gray-300 text-xs sm:text-sm text-center">
        <ClockIcon className="h-4 w-4 text-red-400" />
        <span className={codeExpiry <= 60 ? "text-red-400 font-medium" : ""}>
          Code expires in {formatTime(codeExpiry)}
        </span>
      </div>

      {/* Verify Button - Responsive */}
      <button
        type="submit"
        disabled={loading || codeExpiry <= 0}
        className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:scale-105 disabled:transform-none transition-all duration-300 text-sm sm:text-base"
      >
        {loading
          ? "Verifying..."
          : codeExpiry <= 0
          ? "Code Expired"
          : "Verify Email"}
      </button>

      {/* Resend OTP - Responsive */}
      <div className="text-center px-2">
        <p className="text-gray-400 text-xs sm:text-sm mb-2">
          Didn't receive the code?
        </p>
        {canResend ? (
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="text-purple-400 hover:text-purple-300 disabled:text-gray-600 text-xs sm:text-sm font-medium transition-colors duration-300"
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </button>
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm">
            Resend available in {formatTime(resendTimer)}
          </p>
        )}
      </div>

      {/* Back Button - Responsive */}
      <button
        type="button"
        onClick={onBack}
        className="w-full py-2 text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-300"
      >
        ← Back to Registration
      </button>
    </form>
  );
};
