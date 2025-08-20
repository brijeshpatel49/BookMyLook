import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { Loading } from "../components/Loading";
import { FaStore, FaStoreAlt } from "react-icons/fa";
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  UsersIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export const MySalon = () => {
  const { user, API, authorizationToken } = useAuth();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    const fetchSalon = async () => {
      try {
        const res = await fetch(`${API}/api/salon/barber/${user._id}`, {
          headers: { Authorization: authorizationToken },
        });
        if (res.ok) {
          const data = await res.json();
          setSalon(data);
        } else {
          setSalon(null);
        }
      } catch (err) {
        setSalon(null);
      }
      setLoading(false);
    };
    fetchSalon();
  }, [API, user, authorizationToken]);

  if (loading) {
    return <Loading />;
  }

  if (!salon) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-8 text-center">
            {/* Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center">
                <BuildingStorefrontIcon className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-white mb-3">
              No Salon Set Up Yet
            </h2>

            {/* Description */}
            <p className="text-gray-300 mb-8">
              Create your salon to start accepting clients and manage your
              appointments.
            </p>

            {/* Button */}
            <button
              onClick={() => navigate("/barber/create-salon")}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
            >
              Create Your Salon
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-8">
          {/* Header */}
          <div className="flex items-center gap-6 border-b border-gray-700/50 pb-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
              <BuildingStorefrontIcon className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {salon.name}
              </h2>
              <div className="flex items-center text-gray-400">
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Created: {new Date(salon.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Salon Details */}
          <div className="space-y-6 mb-8">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center">
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Address
                </h3>
                <p className="text-gray-300">{salon.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-xl flex items-center justify-center">
                <PhoneIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                <p className="text-gray-300">{salon.phone}</p>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Opening Hours
                </h3>
                <p className="text-gray-300">{salon.openingHour}</p>
              </div>
            </div>

            {/* Barbers */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-xl flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Barbers ({(salon.barbers || []).length})
                </h3>
                {salon.barbers && salon.barbers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {salon.barbers.map((barber, index) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      >
                        {barber.username}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No barbers assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate(`/barber/edit-salon/${salon._id}`)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit Salon
          </button>
        </div>
      </div>
    </main>
  );
};
