import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import {
  EnvelopeIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export const ForgetPass = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""], // Array for 6 OTP boxes
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  // Refs for OTP inputs
  const otpRefs = useRef([]);
  
  const navigate = useNavigate();
  const { API } = useAuth();

  // Initialize OTP refs
  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  // Start OTP timer
  const startTimer = () => {
    setOtpTimer(60);
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle regular input changes (email, passwords)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle OTP input changes
  const handleOTPChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) value = value.slice(-1);
    
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    
    setFormData(prev => ({
      ...prev,
      otp: newOtp
    }));

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP input key events
  const handleOTPKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const otpArray = text.replace(/\D/g, '').slice(0, 6).split('');
        const newOtp = [...formData.otp];
        
        otpArray.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        
        setFormData(prev => ({ ...prev, otp: newOtp }));
        
        // Focus last filled input or next empty
        const lastIndex = Math.min(otpArray.length - 1, 5);
        otpRefs.current[lastIndex]?.focus();
      });
    }
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP sent to your email!");
        setStep(2);
        startTimer();
        // Focus first OTP input after a short delay
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    const otpString = formData.otp.join('');
    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/forgot-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: otpString 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP verified successfully!");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email,
          otp: formData.otp.join(''),
          newPassword: formData.newPassword 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP resent to your email!");
        // Clear existing OTP
        setFormData(prev => ({
          ...prev,
          otp: ["", "", "", "", "", ""]
        }));
        startTimer();
        // Focus first input
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md mx-auto" // Added mx-auto for better centering
      >
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-6 sm:p-8"> {/* Responsive padding */}
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8"> {/* Responsive margin */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"> {/* Responsive size */}
              <KeyIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" /> {/* Responsive icon */}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2"> {/* Responsive text */}
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Password"}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm"> {/* Responsive text */}
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create your new password"}
            </p>
          </div>

          {/* Step Progress Indicator */}
          <div className="flex items-center justify-center mb-6 sm:mb-8"> {/* Responsive margin */}
            <div className="flex items-center space-x-2 sm:space-x-4"> {/* Responsive spacing */}
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    stepNumber <= step
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}> {/* Responsive size */}
                    {stepNumber < step ? (
                      <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" /> // Responsive icon
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-4 sm:w-8 h-0.5 transition-all duration-300 ${
                      stepNumber < step ? "bg-purple-500" : "bg-gray-700"
                    }`} /> // Responsive width
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4 sm:space-y-6"> {/* Responsive spacing */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2"> {/* Responsive text */}
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> {/* Responsive icon */}
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm sm:text-base" // Responsive padding and text
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base" // Added cursor-pointer and responsive text
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification with 6 boxes */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-6"> {/* Responsive spacing */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3 sm:mb-4 text-center"> {/* Responsive text and margin */}
                  Enter 6-Digit OTP
                </label>
                
                {/* 6 OTP Input Boxes - Fixed Responsiveness */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-2"> {/* Added padding and responsive gap */}
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={formData.otp[index]}
                      onChange={(e) => handleOTPChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 flex-shrink-0" // Fixed responsive size and flex-shrink-0
                      placeholder="0"
                    />
                  ))}
                </div>
                
                <p className="text-gray-400 text-xs text-center">
                  OTP sent to: <span className="text-purple-400 break-all">{formData.email}</span> {/* Added break-all for long emails */}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base" // Added cursor-pointer
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                {otpTimer > 0 ? (
                  <p className="text-gray-400 text-xs sm:text-sm"> {/* Responsive text */}
                    Resend OTP in {otpTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer" // Added cursor-pointer and responsive text
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6"> {/* Responsive spacing */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2"> {/* Responsive text */}
                  New Password
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> {/* Responsive icon */}
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm sm:text-base" // Responsive padding and text
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer" // Added cursor-pointer
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" /> // Responsive icon
                    ) : (
                      <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" /> // Responsive icon
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2"> {/* Responsive text */}
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> {/* Responsive icon */}
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm sm:text-base" // Responsive padding and text
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer" // Added cursor-pointer
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" /> // Responsive icon
                    ) : (
                      <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" /> // Responsive icon
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base" // Added cursor-pointer
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-4 sm:mt-6 text-center"> {/* Responsive margin */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 text-xs sm:text-sm font-medium transition-colors duration-300 cursor-pointer" // Added cursor-pointer and responsive text
            >
              <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" /> {/* Responsive icon */}
              Back to Login
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-700/50 text-center"> {/* Responsive margin */}
            <p className="text-gray-400 text-xs sm:text-sm"> {/* Responsive text */}
              BookMyLook © 2025
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
