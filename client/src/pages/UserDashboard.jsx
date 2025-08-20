import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ClockIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";

export const UserDashboard = () => {
  const { user, API, authorizationToken } = useAuth();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSalons = async () => {
      try {
        const res = await fetch(`${API}/api/salon`, {
          headers: { Authorization: authorizationToken },
        });
        const allSalons = (await res.json()) || [];
        const userSalons = allSalons.filter(
          (salon) =>
            salon.queue &&
            salon.queue.some((queueUser) => queueUser._id === user._id)
        );
        setSalons(userSalons);
      } catch (error) {
        setSalons([]);
      }
      setLoading(false);
    };
    fetchUserSalons();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT: User Info */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-700/50">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                  <UserIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {user.username}
                  </h2>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    User
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-purple-400" />
                  Profile Details
                </h3>

                <div className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-xs block">Email</span>
                      <span className="text-white text-sm">{user.email}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-xs block">Phone</span>
                      <span className="text-white text-sm">{user.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors duration-300 cursor-pointer"
                >
                  <UserIcon className="h-4 w-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/salons")}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors duration-300 cursor-pointer"
                >
                  <BuildingStorefrontIcon className="h-4 w-4" />
                  Browse Salons
                </button>
              </div>
            </div>

            {/* RIGHT: Booked Salons */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <QueueListIcon className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">
                  Your Queue Status
                </h3>
                {salons.length > 0 && (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {salons.length}
                  </span>
                )}
              </div>

              {salons.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {salons.map((salon) => (
                    <div
                      key={salon._id}
                      className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <BuildingStorefrontIcon className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <h4 className="font-bold text-white text-sm truncate">
                              {salon.name}
                            </h4>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2 text-gray-400">
                              <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{salon.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                              <span>{salon.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <ClockIcon className="h-3 w-3 flex-shrink-0" />
                              <span>{salon.openingHour}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {salon.queue.findIndex(
                                (q) => q._id === user._id
                              ) + 1}
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">
                              Position
                            </span>
                          </div>

                          <button
                            onClick={() => navigate(`/salons/${salon._id}`)}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-medium transition-colors duration-300 cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <QueueListIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <h4 className="text-gray-400 font-medium mb-2">
                    No active bookings
                  </h4>
                  <p className="text-gray-500 text-sm mb-4">
                    You haven't joined any salon queue yet
                  </p>
                  <button
                    onClick={() => navigate("/salons")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-colors duration-300 cursor-pointer"
                  >
                    <BuildingStorefrontIcon className="h-4 w-4" />
                    Find Salons
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
