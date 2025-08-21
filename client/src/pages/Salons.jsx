import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loading } from "../components/Loading";
import { motion } from "framer-motion"; // Added motion import
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { AuthModal } from "../components/AuthModal";

// Animation variant matching your example
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const Salons = () => {
  const { API, authorizationToken, user, isLoggedIn } = useAuth();
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  // Fetch favorites properly from API
  const fetchFavorites = async () => {
    if (!user?._id || !isLoggedIn) return;

    try {
      const res = await fetch(`${API}/api/auth/${user._id}/favorites`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (!res.ok) {
        setFavorites([]);
        return;
      }
      const data = await res.json();
      const favoritesArray = data.favorites || data || [];
      const favIds = favoritesArray.map((fav) =>
        typeof fav === "string" ? fav : fav._id.toString()
      );
      setFavorites(favIds);
    } catch {
      setFavorites([]);
    }
  };

  // Fetch all salons
  const fetchSalons = async () => {
    try {
      const res = await fetch(`${API}/api/salon/`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSalons(data);
        setFilteredSalons(data);
      } else {
        setSalons([]);
        setFilteredSalons([]);
      }
    } catch {
      setSalons([]);
      setFilteredSalons([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn && user?.role === "barber") {
      navigate("/barber/dashboard");
      return;
    }
    const fetchData = async () => {
      await fetchFavorites();
      await fetchSalons();
    };
    fetchData();
  }, [authorizationToken, API, user?._id, isLoggedIn]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSalons(salons);
    } else {
      const filtered = salons.filter((salon) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          salon.name.toLowerCase().includes(searchLower) ||
          salon.address.toLowerCase().includes(searchLower) ||
          (salon.barbers || []).some((barber) =>
            barber.username?.toLowerCase().includes(searchLower)
          ) ||
          salon.phone?.includes(searchTerm)
        );
      });
      setFilteredSalons(filtered);
    }
  }, [searchTerm, salons]);

  // Add to favorites API call
  const addFavorite = async (salonId) => {
    try {
      const res = await fetch(
        `${API}/api/auth/${user._id}/favorites/${salonId}`,
        {
          method: "POST",
          headers: { Authorization: authorizationToken },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Added to favorites");
        setFavorites((prev) => [...prev, salonId]);
      } else {
        toast.error(data.message || "Failed to add favorite");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // Remove from favorites API call
  const removeFavorite = async (salonId) => {
    try {
      const res = await fetch(
        `${API}/api/auth/${user._id}/favorites/${salonId}`,
        {
          method: "DELETE",
          headers: { Authorization: authorizationToken },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Removed from favorites");
        setFavorites((prev) => prev.filter((id) => id !== salonId));
      } else {
        toast.error(data.message || "Failed to remove favorite");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // Toggle favorite add/remove with login verification
  const toggleFavorite = (salonId) => {
    if (!isLoggedIn) {
      setAuthModalTab("login");
      setShowAuthModal(true);
      return;
    }

    if (!user?._id) {
      toast.error("User session expired. Please login again.");
      setAuthModalTab("login");
      setShowAuthModal(true);
      return;
    }

    if (favorites.includes(salonId)) {
      removeFavorite(salonId);
    } else {
      addFavorite(salonId);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Discover Salons
          </h2>
          <p className="text-gray-300 mb-6">
            Find and book your perfect salon experience
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search salons, locations, or barbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Results Counter */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-300 text-center">
              {filteredSalons.length === 0
                ? "No salons found"
                : `Found ${filteredSalons.length} salon${
                    filteredSalons.length !== 1 ? "s" : ""
                  }`}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Salons Grid - Exact same animation pattern as your recipe cards */}
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredSalons.length === 0 && !loading && (
            <div className="col-span-full text-center py-16">
              <BuildingStorefrontIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchTerm ? "No salons found" : "No salons available"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back later for new salons"}
              </p>
            </div>
          )}

          {filteredSalons.map((salon) => {
            const isFavorite =
              isLoggedIn && favorites.includes(salon._id.toString());
            return (
              // Exact same animation pattern as your recipe cards
              <motion.div
                key={salon._id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="w-full h-full flex flex-col"
              >
                <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-6 hover:border-purple-500/30 hover:shadow-purple-500/20 transition-all duration-300 hover:scale-101 relative h-full">
                  {/* Favorite Heart */}
                  <button
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                    onClick={() => toggleFavorite(salon._id.toString())}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 focus:outline-none ${
                      isLoggedIn
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-gray-700/30 opacity-80"
                    }`}
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon
                        className={`h-6 w-6 ${
                          isLoggedIn
                            ? "text-gray-400 hover:text-red-500"
                            : "text-gray-500 hover:text-gray-400"
                        }`}
                      />
                    )}
                  </button>

                  {/* Login Tooltip for Non-logged users */}
                  {!isLoggedIn && (
                    <div className="absolute top-12 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none">
                      Login to add favorites
                    </div>
                  )}

                  {/* Salon Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <BuildingStorefrontIcon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 leading-tight">
                        {salon.name.length > 15 ? (
                          <div>
                            <div>
                              {salon.name.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div>
                              {salon.name.split(" ").slice(2).join(" ")}
                            </div>
                          </div>
                        ) : (
                          salon.name
                        )}
                      </h3>

                      <div className="flex items-center text-gray-400">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{salon.openingHour}</span>
                      </div>
                    </div>
                  </div>

                  {/* Salon Details */}
                  <div className="space-y-3 mb-6 flex-grow">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">
                        {salon.address}
                      </span>
                    </div>

                    {/* Phone */}
                    {salon.phone && (
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">
                          {salon.phone}
                        </span>
                      </div>
                    )}

                    {/* Barbers */}
                    <div className="flex items-start gap-3">
                      <UsersIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {salon.barbers && salon.barbers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {salon.barbers.slice(0, 3).map((barber, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              >
                                {barber.username || "Unknown"}
                              </span>
                            ))}
                            {salon.barbers.length > 3 && (
                              <span className="text-gray-400 text-xs">
                                +{salon.barbers.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No barbers assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-102 transition-all duration-300 cursor-pointer mt-auto"
                    onClick={() => navigate(`/salons/${salon._id}`)}
                  >
                    View Details & Book
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </main>
  );
};
