// pages/SalonDetails.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-hot-toast";
import { Loading } from "../components/Loading";
import { AuthModal } from "../components/AuthModal";
import { ShareModal } from "../components/ShareModal";
import io from "socket.io-client";
import { SOCKET_EVENTS } from "../utils/SocketEvents";
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  QueueListIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  XMarkIcon,
  ShareIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export const SalonDetails = () => {
  const { id } = useParams();
  const { API, authorizationToken, user, isLoggedIn } = useAuth();

  // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const [showShareModal, setShowShareModal] = useState(false);

  // ✅ Check if user is barber - but don't return early
  const isBarber = isLoggedIn && user?.role === "barber";

  // Add this function first (before useEffects)
  const checkUserInAnyQueue = async () => {
    if (!user?._id) return false;

    try {
      const res = await fetch(`${API}/api/auth/${user._id}/current-queue`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (res.ok) {
        const data = await res.json();
        return data.inQueue;
      }
      return false;
    } catch (error) {
      console.error("Error checking queue status:", error);
      return false;
    }
  };

  // Fetch salon data
  const fetchSalon = async () => {
    try {
      const res = await fetch(`${API}/api/salon/${id}`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await res.json();
      setSalon(data);
    } catch (err) {
      setSalon(null);
    }
    setLoading(false);
  };

  // Access Control - Check if user is barber
  useEffect(() => {
    if (isBarber) {
      navigate("/barber/dashboard");
      return;
    }
  }, [isLoggedIn, user, navigate, isBarber]);

  // Initialize socket and fetch salon data
  useEffect(() => {
    if (isBarber) return; // Don't fetch data for barbers
    fetchSalon();
  }, [API, id, authorizationToken, isLoggedIn, user, isBarber]);

  // Initialize socket connection when salon is loaded
  useEffect(() => {
    if (isBarber || !salon?._id) return;

    const newSocket = io(API);
    setSocket(newSocket);

    // Join salon room
    newSocket.emit(SOCKET_EVENTS.JOIN_SALON_ROOM, salon._id);

    // Listen for queue updates
    newSocket.on(SOCKET_EVENTS.QUEUE_UPDATED, (updatedQueue) => {
      setSalon((prev) => ({ ...prev, queue: updatedQueue }));
    });

    return () => {
      newSocket.close();
    };
  }, [salon?._id, API, isBarber]);

  // Handle join queue - prevent if salon is closed
  const handleJoinQueue = async () => {
    if (!isLoggedIn) {
      setAuthModalTab("login");
      setShowAuthModal(true);
      return;
    }

    if (!user?._id) {
      toast.error("User session expired. Please login again.");
      setAuthModalTab("login");
      setShowAuthModal(true);
      return;
    }

    // ✅ Check if salon is closed
    if (!salon.isOpen) {
      toast.error("This salon is currently closed. Queue is on hold.");
      return;
    }

    if (joining) return;
    setJoining(true);

    try {
      // ✅ Check if user is already in any queue
      const isInAnyQueue = await checkUserInAnyQueue();

      if (isInAnyQueue) {
        toast.error(
          "You are already in a queue at another salon. Please cancel your current queue first."
        );
        setJoining(false);
        return;
      }

      // ✅ Check if user is already in THIS salon's queue
      const alreadyInThisQueue = salon.queue?.some((u) => u._id === user._id);

      if (alreadyInThisQueue) {
        toast.error("You are already in this salon's queue.");
        setJoining(false);
        return;
      }

      // Proceed with joining the queue
      const res = await fetch(`${API}/api/salon/${id}/queue`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("You joined the queue!");
        setSalon((prev) => ({ ...prev, queue: data.queue }));

        if (socket && socket.connected) {
          socket.emit(SOCKET_EVENTS.CUSTOMER_JOIN_QUEUE, {
            salonId: salon._id,
            userId: user._id,
          });
        }
      } else {
        toast.error(data.message || "Could not join queue");
      }
    } catch (error) {
      console.error("Join queue error:", error);
      toast.error("Server error");
    }
    setJoining(false);
  };

  // Handle cancel queue
  const handleCancelQueue = async () => {
    setJoining(true);
    try {
      const res = await fetch(
        `${API}/api/salon/${id}/queue/delete/${user._id}`,
        {
          method: "DELETE",
          headers: { Authorization: authorizationToken },
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Removed from queue");
        setSalon((prev) => ({ ...prev, queue: data.queue }));

        // Emit socket event for live updates
        if (socket && socket.connected) {
          socket.emit(SOCKET_EVENTS.CUSTOMER_LEAVE_QUEUE, {
            salonId: salon._id,
            userId: user._id,
          });
        }
      } else {
        toast.error(data.message || "Could not remove from queue");
      }
    } catch (err) {
      toast.error("Server error");
    }
    setJoining(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  // If user is barber, show access denied screen
  if (isBarber) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-red-500/10 p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl flex items-center justify-center">
                <ExclamationTriangleIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Access Restricted
            </h2>
            <p className="text-gray-300 mb-6">
              This page is for customers only. As a barber, please use your
              dashboard to manage your salon and services.
            </p>
            <button
              onClick={() => navigate("/barber/dashboard")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
            >
              Go to Dashboard
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (!salon || !salon._id) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Salon not found.
      </div>
    );
  }

  const alreadyInQueue = salon.queue?.some((u) => u._id === user?._id);
  const isOpen = salon.isOpen ?? true; // Default to true if undefined

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT SIDE - Salon Details */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-700/50">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <BuildingStorefrontIcon className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 leading-tight">
                      {/* Mobile: Split long names, Desktop: Show full name */}
                      <span className="block sm:hidden">
                        {salon.name.length > 15 ? (
                          <div>
                            <div>
                              {salon.name.split(" ").slice(0, 2).join(" ")}
                            </div>
                            {salon.name.split(" ").length > 2 && (
                              <div className="text-lg">
                                {salon.name.split(" ").slice(2).join(" ")}
                              </div>
                            )}
                          </div>
                        ) : (
                          salon.name
                        )}
                      </span>

                      {/* Desktop: Always show full name */}
                      <span className="hidden sm:block">{salon.name}</span>
                    </h2>
                    <button
                      onClick={handleShare}
                      className="relative flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-purple-600/20 border border-gray-700/50 hover:border-purple-500/40 rounded-full text-gray-400 hover:text-purple-300 text-sm transition-all duration-300 group hover:scale-105"
                      title="Share salon"
                    >
                      <ShareIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-xs opacity-75">Share</span>
                    </button>
                  </div>
                  {/* Removed opening time and created date from header */}
                </div>
              </div>

              {/* Salon Details with Open/Closed Tag */}
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 mb-6 relative">
                <h3 className="text-lg font-bold text-white mb-4">Details</h3>

                {/* Open/Closed Tag - Right side of details */}
                <span className={`absolute right-4 top-4 text-sm font-medium px-3 py-1 rounded-full ${
                  isOpen 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {isOpen ? "Open" : "Closed"}
                </span>

                <div className="space-y-4 pr-20">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-xs block">
                        Address
                      </span>
                      <span className="text-white text-sm">
                        {salon.address}
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-xs block">Phone</span>
                      <span className="text-white text-sm">
                        {salon.phone || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Hours - Moved from header to here */}
                  <div className="flex items-start gap-3">
                    <CalendarDaysIcon className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-xs block">Hours</span>
                      <span className="text-white text-sm">{salon.openingHour}</span>
                    </div>
                  </div>

                  {/* Barbers */}
                  <div className="flex items-start gap-3">
                    <UsersIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-xs block">
                        Barbers ({salon.barbers?.length || 0})
                      </span>
                      {salon.barbers && salon.barbers.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {salon.barbers.slice(0, 3).map((barber, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            >
                              {barber.username}
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
                          No barbers listed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ RIGHT SIDE - Queue with Hold Effect (Same as BarberDashboard) */}
            <div className={`p-6 relative transition-all duration-300 ${!isOpen ? "pointer-events-none select-none" : ""}`}>
              {!isOpen && (
                <div className="absolute inset-0 flex justify-center items-center z-20 rounded-2xl
                  bg-white/5 backdrop-blur-sm transition-all duration-500">
                  <div className="flex flex-col items-center gap-2 p-6 bg-black/30 rounded-xl shadow-xl backdrop-blur-sm">
                    <InformationCircleIcon className="h-10 w-10 text-gray-300 mb-1" />
                    <h4 className="text-lg sm:text-xl font-bold text-gray-100 tracking-wide">
                      Queue On Hold
                    </h4>
                    <p className="text-gray-200 text-sm text-center leading-relaxed max-w-xs">
                      The salon is currently <span className="font-semibold text-gray-100">closed</span>.<br />
                      All queue actions are paused.<br />
                      Queue will resume when the salon reopens.
                    </p>
                  </div>
                </div>
              )}
              
              <div className={`${!isOpen ? "opacity-40 blur-sm" : ""} transition duration-300`}>
                <div className="flex items-center gap-2 mb-4">
                  <QueueListIcon className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Current Queue</h3>
                  {salon.queue && salon.queue.length > 0 && (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {salon.queue.length} waiting
                    </span>
                  )}
                </div>

                {/* Live connection indicator */}
                {socket && socket.connected && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">
                      Live updates active
                    </span>
                  </div>
                )}

                {/* Queue List */}
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 mb-6 min-h-[200px]">
                  {salon.queue && salon.queue.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {salon.queue.map((client, i) => {
                        const isCurrentUser =
                          client._id === user?._id ||
                          client.username === user?.username;
                        return (
                          <div
                            key={client._id || i}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                              isCurrentUser
                                ? "bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border border-purple-400/50 shadow-lg shadow-purple-500/20"
                                : "bg-gray-800/50 border border-gray-700/50"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                                isCurrentUser
                                  ? "bg-gradient-to-r from-purple-400 to-indigo-400"
                                  : "bg-gradient-to-r from-gray-500 to-gray-600"
                              }`}
                            >
                              {i + 1}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                isCurrentUser ? "text-purple-200" : "text-white"
                              }`}
                            >
                              {isCurrentUser
                                ? client.username
                                : `Client ${i + 1}`}
                            </span>
                            {isCurrentUser && (
                              <span className="ml-auto text-xs text-purple-300 font-medium">
                                (You)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <QueueListIcon className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          No clients in queue
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!alreadyInQueue ? (
                    <button
                      disabled={joining || !isOpen}
                      onClick={handleJoinQueue}
                      className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl shadow-lg transform transition-all duration-300 disabled:opacity-50 disabled:transform-none cursor-pointer ${
                        isLoggedIn && isOpen
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
                          : "bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-white shadow-purple-500/10"
                      }`}
                      title={
                        !isLoggedIn 
                          ? "Login required to join queue" 
                          : !isOpen 
                          ? "Salon is closed - queue on hold"
                          : ""
                      }
                    >
                      <UserPlusIcon className="h-5 w-5" />
                      {joining
                        ? "Joining..."
                        : !isOpen
                        ? "Queue On Hold"
                        : isLoggedIn
                        ? "Join Queue"
                        : "Login to Join Queue"}
                    </button>
                  ) : (
                    <button
                      onClick={handleCancelQueue}
                      disabled={joining}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none cursor-pointer"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      {joining ? "Canceling..." : "Cancel Queue"}
                    </button>
                  )}

                  {/* Login prompt for non-logged users */}
                  {!isLoggedIn && isOpen && (
                    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                      <p className="text-gray-300 text-sm text-center">
                        <span className="text-purple-400 font-medium">
                          New to BookMyLook?
                        </span>
                        <br />
                        Create an account to join queues and save favorites
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </main>
  );
};
