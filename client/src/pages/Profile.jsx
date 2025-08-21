import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-hot-toast";
import { Loading } from "../components/Loading";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { user, API, authorizationToken, refreshUser, isLoggedIn } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      navigate("/");
    }
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
      });
      setLoading(false);
    }
  }, [user]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          username: profile.username,
          phone: profile.phone,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
        refreshUser && refreshUser();
        setEditMode(false);
      } else {
        toast.error(data.message || "Could not update profile");
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
      <div className="w-full max-w-lg">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
            <div className="flex items-center justify-center">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  profile.role === "admin"
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : profile.role === "barber"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-green-500/20 text-green-300 border border-green-500/30"
                }`}
              >
                {profile.role}
              </span>
            </div>
          </div>

          {!editMode ? (
            // VIEW MODE
            <div className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-purple-400" />
                  Username
                </label>
                <div className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                  {profile.username}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4 text-purple-400" />
                  Email
                </label>
                <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400">
                  {profile.email}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-purple-400" />
                  Phone
                </label>
                <div className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                  {profile.phone}
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4 text-purple-400" />
                  Role
                </label>
                <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 capitalize">
                  {profile.role}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditMode(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-102 transition-all duration-300 cursor-pointer"
              >
                <PencilIcon className="h-5 w-5" />
                Edit Profile
              </button>
            </div>
          ) : (
            // EDIT MODE
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-purple-400" />
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={profile.username}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4 text-purple-400" />
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-purple-400" />
                  Phone
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4 text-purple-400" />
                  Role
                </label>
                <div className="relative">
                  <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    name="role"
                    value={profile.role}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed capitalize"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-102 transition-all duration-300 cursor-pointer"
                >
                  <CheckIcon className="h-5 w-5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-102 transition-all duration-300 cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};
