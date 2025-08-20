import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const getMenuItems = (role) => {
  if (role === "user") {
    return [
      { label: "Dashboard", to: "/user/dashboard" },
      { label: "Salons", to: "/salons" },
      { label: "Favorites", to: "/user/favorites" },
    ];
  }
  if (role === "barber") {
    return [
      { label: "Dashboard", to: "/barber/dashboard" },
      { label: "My Salons", to: "/barber/my-salon" },
    ];
  }
  if (role === "admin") {
    return [
      { label: "Dashboard", to: "/admin" },
      { label: "Users", to: "/admin/users" },
      { label: "Salons", to: "/admin/salons" },
    ];
  }
  return [];
};

export const Navbar = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoggedIn, LogoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = isLoggedIn ? getMenuItems(user?.role) : [];
  const isProfileActive = location.pathname === "/profile";
  const isRegisterActive = location.pathname.startsWith("/register");

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleMobileProfileClick = () => {
    setSidebarOpen(false);
    navigate("/profile");
  };

  return (
    <div className="min-h-4rem bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Updated with BookMyLook branding */}
            <NavLink to="/" className="flex items-center">
              <div className="flex items-center space-x-3 group">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src="/logo.png"
                      alt="BML"
                      className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-indigo-300 transition-all duration-300">
                  BookMyLook
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation - Enhanced with User Info */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {/* Navigation Links */}
                  <div className="flex items-center space-x-1">
                    {menuItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                          `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                            isActive
                              ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                              : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {item.label}
                            <span
                              className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 ${
                                isActive ? "w-full" : "w-0 group-hover:w-full"
                              }`}
                            ></span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>

                  {/* User Profile Section - With Active State */}
                  <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                    <div
                      className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                        isProfileActive
                          ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`}
                      onClick={handleProfileClick}
                      title="Go to Profile"
                    >
                      {/* User Avatar */}
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-sm font-semibold group-hover:scale-110 transition-transform duration-300">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>

                      {/* Username */}
                      <span
                        className={`transition-colors duration-300 ${
                          isProfileActive
                            ? "text-purple-300"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {user?.username}
                      </span>

                      {/* Role Badge */}
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full capitalize">
                        {user?.role}
                      </span>

                      {/* Active/Hover state underline */}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 ${
                          isProfileActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </div>

                    {/* Simple Logout Button with zoom effect */}
                    <button
                      onClick={LogoutUser}
                      className="p-3 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                      title="Logout"
                    >
                      <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                        isActive
                          ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        Home
                        <span
                          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        ></span>
                      </>
                    )}
                  </NavLink>
                  <NavLink
                    to="/salons"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                        isActive
                          ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        Salons
                        <span
                          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        ></span>
                      </>
                    )}
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                        isActive
                          ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        Login
                        <span
                          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        ></span>
                      </>
                    )}
                  </NavLink>
                  <NavLink
                    to="/register/user"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                      isRegisterActive
                        ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    Register
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 ${
                        isRegisterActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-300 hover:text-white cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Enhanced */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-gray-900/95 backdrop-blur-xl border-r border-white/10 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header with User Info */}
        <div className="border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="BookMyLook"
                className="h-10 w-auto mx-auto hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
                style={{
                  filter: "drop-shadow(0 0 2rem rgba(139, 92, 246, 0.4))",
                }}
              />
              <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-indigo-300 transition-all duration-300">
                BookMyLook
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-300 hover:text-white cursor-pointer"
              aria-label="Close Menu"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* User info in mobile - With Active State */}
          {isLoggedIn && (
            <div
              className={`mx-6 mb-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 relative group ${
                isProfileActive
                  ? "bg-purple-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/30"
                  : "bg-gray-800/50 hover:bg-gray-700/50"
              }`}
              onClick={handleMobileProfileClick}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center font-semibold group-hover:scale-110 transition-transform duration-300">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    className={`font-medium transition-colors duration-300 ${
                      isProfileActive
                        ? "text-purple-200"
                        : "text-white group-hover:text-purple-200"
                    }`}
                  >
                    {user?.username}
                  </p>
                  <p className="text-xs text-purple-300 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              {/* Active/Hover state underline for mobile */}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 rounded-full ${
                  isProfileActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </div>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-6 py-6 space-y-2">
          {isLoggedIn ? (
            <>
              {menuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Enhanced Mobile Logout Button */}
              <div className="relative overflow-hidden group">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    LogoutUser();
                  }}
                  className="relative w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
                >
                  <div className="flex items-center relative">
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      Logout
                    </span>
                  </div>
                  {/* Sliding underline */}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-300 w-0 group-hover:w-full"></span>
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/salons"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                Salons
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register/user"
                className={
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isRegisterActive
                      ? "text-purple-300 bg-purple-500/20 shadow-lg shadow-purple-500/30 border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Push Content Below Navbar */}
      <main className="pt-16">{children}</main>
    </div>
  );
};
