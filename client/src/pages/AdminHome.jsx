import { NavLink } from "react-router-dom";
import { UsersIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
export const AdminHome = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4">
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
        {/* Header */}
        <div className="items-center justify-center mb-6">
          <img
            src="/logo.png"
            alt="BookMyLook"
            className="h-16 w-auto mx-auto hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 0 2rem rgba(139, 92, 246, 0.4))",
            }}
          />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
        </div>

        <p className="text-gray-300 mb-8">
          Manage your BookMyLook platform from here.
        </p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 gap-4">
          <NavLink
            to="/admin/users"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <UsersIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            Manage Users
          </NavLink>

          <NavLink
            to="/admin/salons"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <BuildingStorefrontIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            Manage Salons
          </NavLink>
        </div>
      </div>
    </main>
  );
};
