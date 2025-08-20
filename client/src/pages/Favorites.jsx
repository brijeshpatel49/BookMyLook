import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { Loading } from "../components/Loading";
import { motion } from 'framer-motion'; // Added motion import
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  HeartIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Animation variant matching your example
const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const Favorites = () => {
  const { user, API, authorizationToken } = useAuth();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    fetch(`${API}/api/auth/${user._id}/favorites`, {
      headers: {
        Authorization: authorizationToken,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const favoritesArray = data.favorites || [];
        setSalons(favoritesArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching favorite salons:", error);
        setSalons([]);
        setLoading(false);
      });
  }, [API, authorizationToken, user?._id]);

  // Remove from favorites API
  const handleRemoveFavorite = async (salonId) => {
    setRemovingId(salonId);
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
        setSalons((prev) => prev.filter((s) => s._id !== salonId));
      } else {
        toast.error(data.message || "Could not remove favorite");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Your Favorite Salons
            </h2>
          </div>
          <p className="text-gray-300">
            {salons.length === 0
              ? "Start adding salons to your favorites"
              : `You have ${salons.length} favorite salon${
                  salons.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        {/* Favorites Grid with increased spacing */}
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {salons.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-500 mb-6">
                Discover and save your favorite salons for quick access
              </p>
              <button
                onClick={() => navigate("/salons")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
              >
                <BuildingStorefrontIcon className="h-5 w-5" />
                Browse Salons
              </button>
            </div>
          ) : (
            salons.map((salon) => (
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
                  {/* Favorite Heart Button */}
                  <button
                    aria-label="Remove from favorites"
                    onClick={() => handleRemoveFavorite(salon._id)}
                    disabled={removingId === salon._id}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-300 focus:outline-none disabled:opacity-50"
                  >
                    <HeartSolidIcon
                      className={`h-6 w-6 transition-colors ${
                        removingId === salon._id
                          ? "text-gray-400"
                          : "text-red-500 hover:text-red-400"
                      }`}
                    />
                  </button>

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
                            <div>{salon.name.split(" ").slice(2).join(" ")}</div>
                          </div>
                        ) : (
                          salon.name
                        )}
                      </h3>

                      <div className="flex items-center text-gray-400 mb-1">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{salon.openingHour}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(salon.createdAt).toLocaleDateString()}
                      </p>
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
                    onClick={() => navigate(`/salons/${salon._id}`)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-102 transition-all duration-300 cursor-pointer mt-auto"
                  >
                    View Details & Book
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};
