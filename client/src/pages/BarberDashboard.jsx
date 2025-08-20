// pages/BarberDashboard.jsx
import { useAuth } from "../store/auth";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loading } from "../components/Loading";
import { ShareModal } from "../components/ShareModal";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "../utils/SocketEvents";
import { Switch } from "@headlessui/react";
import {
  UserIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  UsersIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  CheckIcon,
  XMarkIcon,
  ShareIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export const BarberDashboard = () => {
  const { user, authorizationToken, API, isLoggedIn } = useAuth();
  const socket = useMemo(() => io(API), [API]);
  const [loading, setLoading] = useState(true);
  const [salon, setSalon] = useState(null);
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // default true, sync to salon?.isOpen below

  // Role check: non-barbers redirected
  useEffect(() => {
    if (isLoggedIn && user?.role !== "barber") {
      toast.error(
        "This page is only accessible to barbers. Please login as a barber."
      );
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate]);

  // Fetch salon data and initialize socket
  useEffect(() => {
    if (!user?._id || user?.role !== "barber") return;

    const fetchSalonAndJoinRoom = async () => {
      try {
        const res = await fetch(`${API}/api/salon/barber/${user._id}`, {
          headers: { Authorization: authorizationToken },
        });
        if (res.ok) {
          const data = await res.json();
          setSalon(data);
          setIsOpen(data.isOpen ?? true); // default to true if undefined
          setLoading(false);
          socket.emit(SOCKET_EVENTS.JOIN_SALON_ROOM, data._id);
        } else {
          setSalon(null);
          setLoading(false);
        }
      } catch (err) {
        setSalon(null);
        setLoading(false);
      }
    };
    fetchSalonAndJoinRoom();
    // eslint-disable-next-line
  }, [API, authorizationToken, user, socket]);

  // Live queue updates
  useEffect(() => {
    if (!salon?._id) return;
    const handleQueueUpdate = (updatedQueue) => {
      setSalon((prev) => ({ ...prev, queue: updatedQueue }));
    };
    socket.on(SOCKET_EVENTS.QUEUE_UPDATED, handleQueueUpdate);
    return () => {
      socket.off(SOCKET_EVENTS.QUEUE_UPDATED, handleQueueUpdate);
    };
  }, [salon?._id, socket]);

  // Actions and toggles
  const toggleOpenStatus = async () => {
    if (!salon?._id) return;
    const res = await fetch(`${API}/api/salon/${salon._id}/open-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorizationToken,
      },
      body: JSON.stringify({ isOpen: !isOpen }),
    });
    if (res.ok) {
      setIsOpen(!isOpen);
      toast.info(`Salon is now ${!isOpen ? "open" : "closed"}`);
    }
  };

  const handleRemoveFromQueue = async (queueUserId) => {
    if (!salon?._id) return;
    try {
      const res = await fetch(
        `${API}/api/salon/${salon._id}/queue/delete/${queueUserId}`,
        { method: "DELETE", headers: { Authorization: authorizationToken } }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Removed from queue");
        setSalon((prev) => ({ ...prev, queue: data.queue }));
        if (socket && socket.connected) {
          socket.emit(SOCKET_EVENTS.BARBER_UPDATE_QUEUE, {
            salonId: salon._id,
            action: "remove_client",
            userId: queueUserId,
          });
        }
      } else {
        toast.error(data.message || "Error removing from queue");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleDone = (queueUserId) => handleRemoveFromQueue(queueUserId);

  const handleAddWalkIn = async () => {
    if (!salon?._id) return;
    try {
      const res = await fetch(`${API}/api/salon/${salon._id}/walkin`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Walk-in client added!");
        setSalon((prev) => ({ ...prev, queue: data.queue }));
        if (socket && socket.connected) {
          socket.emit(SOCKET_EVENTS.BARBER_UPDATE_QUEUE, {
            salonId: salon._id,
            action: "add_walkin",
          });
        }
      } else {
        toast.error(data.message || "Failed to add walk-in");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleShareSalon = () => setShowShareModal(true);

  if (loading) return <Loading />;

  // Non-barber fallback already handled by early useEffect above.

  if (!salon) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center">
                <BuildingStorefrontIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No Salon Set Up Yet
            </h2>
            <p className="text-gray-300 mb-8">
              Create your salon to start accepting clients and manage your
              appointments.
            </p>
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
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Barber Info & Salon Details */}
            <div className="p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-700/50">
              {/* Barber Profile */}
              <div className="flex items-center gap-4 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserIcon className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 truncate">
                      {user.username}
                    </h2>
                    <button
                      onClick={handleShareSalon}
                      className="relative flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-purple-600/20 border border-gray-700/50 hover:border-purple-500/40 rounded-full text-gray-400 hover:text-purple-300 text-sm transition-all duration-300 group hover:scale-105"
                      title="Share salon"
                    >
                      <ShareIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-xs opacity-75">Share</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2 truncate">
                    {user.email}
                  </p>
                  <span className="inline-flex px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Barber
                  </span>
                </div>
              </div>
              {/* Salon Details */}
              <div className="bg-gray-900/50 rounded-xl p-4 lg:p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    Salon Details
                  </h3>
                  {/* Status Toggle in Header */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        isOpen ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isOpen ? "Open" : "Closed"}
                    </span>
                    <Switch
                      checked={isOpen}
                      onChange={toggleOpenStatus}
                      className={`${
                        isOpen ? "bg-green-500" : "bg-red-500"
                      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-pointer`}
                    >
                      <span className="sr-only">Toggle Open Status</span>
                      <span
                        className={`${
                          isOpen ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </Switch>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {/* Salon Name */}
                  <div className="flex items-start gap-3">
                    <BuildingStorefrontIcon className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-400 text-xs sm:text-sm block">
                        Name
                      </span>
                      <span className="text-white text-sm sm:text-base font-semibold truncate block">
                        {salon.name}
                      </span>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-400 text-xs sm:text-sm block">
                        Address
                      </span>
                      <span className="text-white text-sm sm:text-base line-clamp-2">
                        {salon.address}
                      </span>
                    </div>
                  </div>
                  {/* Phone & Hours */}
                  <div className="grid grid-cols-1 min-[500px]:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-start gap-3">
                      <PhoneIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-400 text-xs sm:text-sm block">
                          Phone
                        </span>
                        <span className="text-white text-sm sm:text-base">
                          {salon.phone}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ClockIcon className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-400 text-xs sm:text-sm block">
                          Hours
                        </span>
                        <span className="text-white text-sm sm:text-base">
                          {salon.openingHour}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Created Date */}
                  <div className="hidden min-[500px]:flex items-start gap-3">
                    <CalendarDaysIcon className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-sm block">
                        Created
                      </span>
                      <span className="text-white">
                        {new Date(salon.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {/* Barbers */}
                  <div className="flex items-start gap-3">
                    <UsersIcon className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-400 text-xs sm:text-sm block">
                        Barbers ({(salon.barbers || []).length})
                      </span>
                      {salon.barbers && salon.barbers.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {salon.barbers.slice(0, 2).map((barber, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 truncate max-w-20 min-[500px]:max-w-none"
                            >
                              {barber.username}
                            </span>
                          ))}
                          {salon.barbers.length > 2 && (
                            <span className="text-gray-400 text-xs">
                              +{salon.barbers.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">
                          No barbers
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Queue Section -- visually hold the queue if closed */}
            <div
              className={`p-4 sm:p-6 lg:p-8 relative transition-all duration-300 ${
                !isOpen ? "pointer-events-none select-none" : ""
              }`}
            >
              {!isOpen && (
                <div
                  className="absolute inset-0 flex justify-center items-center z-20 rounded-2xl
      bg-white/5 backdrop-blur-sm transition-all duration-500"
                >
                  <div className="flex flex-col items-center gap-2 p-6 bg-black/30 rounded-xl shadow-xl backdrop-blur-sm">
                    <InformationCircleIcon className="h-10 w-10 text-gray-300 mb-1" />
                    <h4 className="text-lg sm:text-xl font-bold text-gray-100 tracking-wide">
                      Queue On Hold
                    </h4>
                    <p className="text-gray-200 text-sm text-center leading-relaxed max-w-xs">
                      The salon is currently{" "}
                      <span className="font-semibold text-gray-100">
                        closed
                      </span>
                      .<br />
                      All queue actions are paused.
                      <br />
                      You can resume queue management after reopening your
                      salon.
                    </p>
                  </div>
                </div>
              )}
              <div
                className={`${
                  !isOpen ? "opacity-40 blur-sm" : ""
                } transition duration-300`}
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <UsersIcon className="h-6 w-6 text-purple-400" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    <span className="min-[500px]:hidden">Queue</span>
                    <span className="hidden min-[500px]:inline">
                      Current Queue
                    </span>
                  </h3>
                  {salon.queue && salon.queue.length > 0 && (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {salon.queue.length}
                    </span>
                  )}
                </div>
                {/* Live connection indicator */}
                {socket && socket.connected && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs">
                      Live queue management active
                    </span>
                  </div>
                )}
                {salon.queue && salon.queue.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
                    {salon.queue.map((qUser, idx) => (
                      <div
                        key={qUser._id}
                        className="flex items-center justify-between bg-gray-900/50 border border-gray-700/50 px-3 sm:px-3 lg:px-4 py-2.5 sm:py-3 rounded-xl hover:border-purple-500/30 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <span className="font-semibold text-white text-sm sm:text-base truncate">
                            {qUser.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors duration-300 cursor-pointer"
                            onClick={() => handleDone(qUser._id)}
                            disabled={!isOpen}
                          >
                            <CheckIcon className="h-4 w-4" />
                            <span className="hidden min-[500px]:inline">
                              Done
                            </span>
                          </button>
                          <button
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors duration-300 cursor-pointer"
                            onClick={() => handleRemoveFromQueue(qUser._id)}
                            disabled={!isOpen}
                          >
                            <XMarkIcon className="h-4 w-4" />
                            <span className="hidden min-[500px]:inline">
                              Remove
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 mb-6 sm:mb-8">
                    <UsersIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-2 sm:mb-4" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-400 mb-1 sm:mb-2">
                      <span className="min-[500px]:hidden">No clients</span>
                      <span className="hidden min-[500px]:inline">
                        No clients in queue
                      </span>
                    </h4>
                    <p className="text-gray-500 text-sm sm:text-base">
                      <span className="min-[500px]:hidden">Queue empty</span>
                      <span className="hidden min-[500px]:inline">
                        Queue is empty right now.
                      </span>
                    </p>
                  </div>
                )}
                {/* Add Walk-in Button */}
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={handleAddWalkIn}
                  disabled={!isOpen}
                >
                  <UserPlusIcon className="h-5 w-5" />
                  <span className="text-sm sm:text-base">
                    <span className="min-[500px]:hidden">Add Client</span>
                    <span className="hidden min-[500px]:inline">
                      Add Walk-in Customer
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={salon.name}
          description={`Check out ${salon.name} on BookMyLook! Join the queue and book your appointment.`}
          forceUserView={true}
          salonId={salon._id}
        />
      </div>
    </main>
  );
};
