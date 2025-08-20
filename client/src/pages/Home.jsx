import { useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { useAuth } from "../store/auth";
import { Loading } from "../components/Loading";
import {
  UserPlusIcon,
  ScissorsIcon,
  StarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  HeartIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

// Simple Animation variants (no complex hover variants)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12
    }
  }
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 12,
      delay: 0.1
    }
  }
};

export const Home = () => {
  const navigate = useNavigate();
  const { user, loading, isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "barber") {
        navigate("/barber/dashboard", { replace: true });
      } else if (user.role === "user") {
        navigate("/user/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (!isLoggedIn) {
    return (
      <div className="bg-black text-white overflow-hidden min-h-screen">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-xl animate-pulse"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500/8 rounded-full filter blur-xl animate-pulse"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/8 rounded-full filter blur-xl animate-pulse"
          />
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Central gradient glow */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[500px] h-[500px] blur-[120px] rounded-full bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/15" />
          </motion.div>

          {/* Hero Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 px-6 max-w-4xl mx-auto text-center"
          >
            {/* Animated Logo */}
            <motion.div 
              variants={logoVariants}
              whileHover={{ scale: 1.05 }} // Simple hover scale
              className="mb-6"
            >
              <img
                src="/logo.png"
                alt="BookMyLook"
                className="h-26 w-auto mx-auto transition-transform duration-200 drop-shadow-2xl cursor-pointer"
                style={{
                  filter: "drop-shadow(0 0 2rem rgba(139, 92, 246, 0.4))",
                }}
              />
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  BookMyLook
                </span>
              </h1>
            </motion.div>

            {/* Enhanced subtext */}
            <motion.p 
              variants={itemVariants}
              className="text-gray-300 mb-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Transform your salon experience with our modern platform.
              <br />
              <span className="text-purple-400"> Book instantly</span>,
              <span className="text-indigo-400"> manage effortlessly</span>,
              <span className="text-pink-400"> look amazing</span>.
            </motion.p>

            {/* Animated CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }} // Simple instant scale
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-purple-500/40 transition-all duration-200 cursor-pointer"
                onClick={() => navigate("/register/user")}
              >
                <div className="relative flex items-center justify-center">
                  <UserPlusIcon className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  Join as Customer
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                onClick={() => navigate("/register/barber")}
              >
                <div className="relative flex items-center justify-center">
                  <ScissorsIcon className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  Join as Professional
                </div>
              </motion.button>
            </motion.div>

            {/* Explore Salons Option */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-400/50 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                onClick={() => navigate("/salons")}
              >
                <div className="relative flex items-center justify-center">
                  <BuildingStorefrontIcon className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  Explore Salons
                  <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.button>
            </motion.div>

            {/* Sign in link */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:underline cursor-pointer"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-20 bg-gradient-to-b from-black via-gray-900/30 to-black">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="max-w-6xl mx-auto px-6"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  How It Works
                </span>
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Simple steps to get your perfect salon experience
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }} // Simple instant scale
                className="text-center group cursor-pointer"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-200">
                    <BuildingStorefrontIcon className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-200" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Find Your Salon
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Browse through our curated list of premium salons in your area with detailed profiles and services.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="text-center group cursor-pointer"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-200">
                    <ClockIcon className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-200" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Join Live Queue
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Skip the physical wait! Join the live queue remotely and track your position in real-time.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="text-center group cursor-pointer"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-200">
                    <StarIcon className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-200" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Get Your Look
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Track your queue position and arrive for your seamless salon experience.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 bg-gradient-to-b from-black via-gray-900/50 to-black">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="max-w-6xl mx-auto px-6"
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Why Choose Us?
                </span>
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Experience innovation, reliability, and style in salon management
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Feature Card 1 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/40 transition-all duration-200 cursor-pointer"
              >
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200">
                  <StarIcon className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Premium Quality
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Connect with top-rated salons and certified professionals for guaranteed excellence.
                </p>
              </motion.div>

              {/* Feature Card 2 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/40 transition-all duration-200 cursor-pointer"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200">
                  <UserGroupIcon className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Trusted Community
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Join thousands of satisfied customers and salon partners in our growing network.
                </p>
              </motion.div>

              {/* Feature Card 3 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/40 transition-all duration-200 cursor-pointer"
              >
                <div className="bg-gradient-to-br from-pink-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200">
                  <CalendarDaysIcon className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Smart Booking
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Real-time availability and intelligent queue management for effortless booking.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="relative py-20 bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="max-w-6xl mx-auto px-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Experience the Future of Salon Booking
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Say goodbye to long waits and uncertainty. Our platform brings modern convenience to traditional salon services.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Real-time queue monitoring",
                    "Professional service guarantee", 
                    "Flexible scheduling options",
                    "Favorite salon management",
                    "Seamless booking experience"
                  ].map((benefit, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      custom={index}
                      className="flex items-center gap-3"
                    >
                      <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center transition-transform duration-200">
                    <HeartIcon className="h-10 w-10 text-white group-hover:rotate-12 transition-transform duration-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Join Our Community</h3>
                  <p className="text-gray-300">Thousands of satisfied customers trust BookMyLook</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/register/user")}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200 cursor-pointer"
                >
                  Start Your Journey Today
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Footer CTA */}
        <section className="relative py-16 bg-gradient-to-t from-gray-900 to-black">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center px-6"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              Ready to Transform Your Salon Experience?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Join BookMyLook today and discover a smarter way to book salon appointments
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/register/user")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200 cursor-pointer"
              >
                Get Started Free
                <ArrowRightIcon className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/salons")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
              >
                Browse Salons First
              </motion.button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }
};
