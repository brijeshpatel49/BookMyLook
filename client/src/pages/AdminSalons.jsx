import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-hot-toast";
import { Loading } from "../components/Loading";
import {
  BuildingStorefrontIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline";

export const AdminSalons = () => {
  const { API, authorizationToken } = useAuth();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await fetch(`${API}/api/admin/salons`, {
          headers: { Authorization: authorizationToken },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch salons: ${res.status}`);
        }
        const data = await res.json();
        setSalons(data);
      } catch (err) {
        toast.error(err.message || "Error fetching salons");
        setSalons([]);
      }
      setLoading(false);
    };
    fetchSalons();
  }, [API, authorizationToken]);

  const handleDelete = async (salonId) => {
    if (!window.confirm("Are you sure you want to delete this salon?")) return;

    setDeletingId(salonId);
    try {
      const res = await fetch(`${API}/api/admin/salons/${salonId}`, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Salon deleted successfully");
        setSalons((prev) => prev.filter((salon) => salon._id !== salonId));
      } else {
        toast.error(data.message || "Failed to delete salon");
      }
    } catch (err) {
      toast.error("Server error");
    }
    setDeletingId(null);
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Manage Salons
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Salons</p>
                <p className="text-2xl font-bold text-white">{salons.length}</p>
              </div>
              <BuildingStorefrontIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Salons</p>
                <p className="text-2xl font-bold text-white">
                  {salons.filter((s) => s.barbers?.length > 0).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Barbers</p>
                <p className="text-2xl font-bold text-white">
                  {salons.reduce(
                    (acc, salon) => acc + (salon.barbers?.length || 0),
                    0
                  )}
                </p>
              </div>
              <ScissorsIcon className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Salons Grid */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-6">
          {salons.length === 0 ? (
            <div className="text-center py-16">
              <BuildingStorefrontIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No salons found
              </h3>
              <p className="text-gray-500">
                Registered salons will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salons.map((salon) => (
                <div
                  key={salon._id}
                  className="group bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-102 transition-all duration-300"
                >
                  {/* Salon Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-3">
                        {salon.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300 truncate">
                          {salon.name}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Salon Details */}
                  <div className="space-y-3 mb-6">
                    {/* Address */}
                    <div className="flex items-center text-gray-300">
                      <MapPinIcon className="h-4 w-4 text-purple-400 mr-3 flex-shrink-0" />
                      <span className="text-sm truncate">{salon.address}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center text-gray-300">
                      <PhoneIcon className="h-4 w-4 text-indigo-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{salon.phone || "N/A"}</span>
                    </div>

                    {/* Barbers */}
                    {salon.barbers && salon.barbers.length > 0 && (
                      <div className="flex items-start text-gray-300">
                        <UsersIcon className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <div className="flex flex-wrap gap-1">
                            {salon.barbers.map((barber, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              >
                                {barber.username}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(salon._id)}
                    disabled={deletingId === salon._id}
                    className="group/btn w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg font-medium disabled:opacity-50 transition-all duration-300 hover:scale-105 border border-red-500/30 hover:border-red-500/50 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                    {deletingId === salon._id ? "Deleting..." : "Delete Salon"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
