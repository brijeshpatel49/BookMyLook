import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-hot-toast";
import { Loading } from "../components/Loading";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import {
  UsersIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export const AdminUsers = () => {
  const { API, authorizationToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Filter out users whose email starts with "walkin"
  const filteredUsers = users.filter(user => 
    !user.email.toLowerCase().startsWith("walkin")
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API}/api/admin/users`, {
          headers: { Authorization: authorizationToken },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        toast.error(err.message || "Error fetching users");
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [API, authorizationToken]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(userId);
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "User deleted successfully");
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } else {
        toast.error(data.message || "Failed to delete user");
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
            <UsersIcon className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Manage Users
            </h1>
          </div>
        </div>

        {/* Stats Cards - Using filtered users for counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{filteredUsers.length}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">
                  {filteredUsers.filter((u) => u.role === "user").length}
                </p>
              </div>
              <UserCircleIcon className="h-8 w-8 text-indigo-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Barbers</p>
                <p className="text-2xl font-bold text-white">
                  {filteredUsers.filter((u) => u.role === "barber").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table - Using filtered users */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <UsersIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                Users will appear here once they register.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : user.role === "barber"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-green-500/20 text-green-300 border border-green-500/30"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                          className="group inline-flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg font-medium disabled:opacity-50 transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                          <TrashIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          {deletingId === user._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
