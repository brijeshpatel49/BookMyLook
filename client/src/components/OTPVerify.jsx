import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  EnvelopeIcon,
  KeyIcon,
  ArrowPathIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../store/auth";

export const OTPVerify = ({ email, onVerificationSuccess, onBack }) => {
  const {API}=useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [codeExpiry, setCodeExpiry] = useState(600); // 10 minutes for code expiry
  const [resendTimer, setResendTimer] = useState(60); // 1 minute for resend timer
  const [canResend, setCanResend] = useState(false);

  // Code expiry timer countdown
  useEffect(() => {
    if (codeExpiry > 0) {
      const timer = setTimeout(() => setCodeExpiry(codeExpiry - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeExpiry]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Verify OTP
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
      const response = await fetch(
        `${API}/api/auth/verify-registration-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpString,
          }),
        }
      );

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

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(
        `${API}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("New OTP sent to your email");
        setCodeExpiry(600); // Reset code expiry to 10 minutes
        setResendTimer(60); // Reset resend timer to 1 minute
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
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
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center">
                <EnvelopeIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-300 text-sm">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-purple-400 font-medium">{email}</p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <KeyIcon className="h-4 w-4 text-purple-400" />
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                ))}
              </div>
            </div>

              {/* Code Expiry Timer */}
              <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                <ClockIcon className="h-4 w-4 text-red-400" />
                <span
                  className={codeExpiry <= 60 ? "text-red-400 font-medium" : ""}
                >
                  Code expires in {formatTime(codeExpiry)}
                </span>
              </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || codeExpiry <= 0}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 disabled:transform-none transition-all duration-300"
            >
              {loading
                ? "Verifying..."
                : codeExpiry <= 0
                ? "Code Expired"
                : "Verify Email"}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 disabled:text-gray-600 text-sm font-medium transition-colors duration-300 mx-auto disabled:cursor-not-allowed"
                >
                  <ArrowPathIcon
                    className={`h-4 w-4 ${resendLoading ? "animate-spin" : ""}`}
                  />
                  {resendLoading ? "Sending..." : "Resend Code"}
                </button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Resend available in {formatTime(resendTimer)}
                </p>
              )}
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300"
            >
              ← Back to Registration
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
