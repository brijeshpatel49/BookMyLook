import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-lg">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-8 text-center">
          {/* Error Icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center">
              <ExclamationTriangleIcon className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>

          <p className="text-gray-300 mb-8 leading-relaxed">
            Sorry, the page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
            >
              <HomeIcon className="h-5 w-5" />
              Go to Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              ← Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <p className="text-gray-400 text-sm mb-4">
              Need help finding something?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/salons")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Browse Salons
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
