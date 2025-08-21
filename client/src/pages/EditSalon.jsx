import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-hot-toast";
import { Loading } from "../components/Loading";
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
export const EditSalon = () => {
  const { salonId } = useParams();
  const { API, user, authorizationToken } = useAuth();
  const [salon, setSalon] = useState({
    name: "",
    address: "",
    phone: "",
    openingHour: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await fetch(`${API}/api/salon/${salonId}`, {
          headers: { Authorization: authorizationToken },
        });
        if (res.ok) {
          const data = await res.json();
          setSalon({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            openingHour: data.openingHour || "",
          });
        } else {
          toast.error("Could not load salon info");
        }
      } catch (err) {
        toast.error("Server error loading salon");
      }
      setLoading(false);
    };
    fetchSalon();
  }, [API, salonId, authorizationToken]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setSalon({ ...salon, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/salon/${salonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(salon),
      });
      const res_data = await response.json();
      if (response.ok) {
        toast.success("Salon updated successfully");
        navigate("/barber/my-salon");
      } else {
        toast.error(res_data.message || "Could not update salon");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center">
                <PencilSquareIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Edit Your Salon
            </h2>
            <p className="text-gray-300">
              Update your salon's details to keep your profile current and
              discoverable.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Salon Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
              >
                <BuildingStorefrontIcon className="h-4 w-4 text-purple-400" />
                Salon Name
              </label>
              <div className="relative">
                <BuildingStorefrontIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Urban Styles"
                  required
                  value={salon.name}
                  onChange={handleInput}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
              >
                <MapPinIcon className="h-4 w-4 text-purple-400" />
                Address
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Full Address"
                  required
                  value={salon.address}
                  onChange={handleInput}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Phone and Opening Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-300 flex items-center gap-2"
                >
                  <PhoneIcon className="h-4 w-4 text-purple-400" />
                  Phone
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="01234 56789"
                    required
                    value={salon.phone}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Opening Hours */}
              <div className="space-y-2">
                <label
                  htmlFor="openingHour"
                  className="text-sm font-medium text-gray-300 flex items-center gap-2"
                >
                  <ClockIcon className="h-4 w-4 text-purple-400" />
                  Opening Hours
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                    id="openingHour"
                    name="openingHour"
                    placeholder="e.g. 9:00 AM - 8:00 PM"
                    required
                    value={salon.openingHour}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
            >
              <PencilSquareIcon className="h-5 w-5" />
              Update Salon
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800/50 text-gray-400">
                  Need help?
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard Link */}
          <div className="text-center">
            <NavLink
              to="/barber/dashboard"
              className="group inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Back to Dashboard
              <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
};
