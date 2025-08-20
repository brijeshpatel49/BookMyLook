// socket/socketHandler.js - Use your existing function
const { SOCKET_EVENTS } = require("../utils/socketEvents");
const Salon = require("../models/salon-model");
const { removeFromQueue } = require("./queueService");

const handleSocketConnections = (io) => {
  io.on("connection", (socket) => {

    // Join salon room
    socket.on(SOCKET_EVENTS.JOIN_SALON_ROOM, (salonId) => {
      socket.join(`salon_${salonId}`);
    });

    // ✅ FIXED: Just broadcast fresh data (HTTP already updated DB)
    socket.on(SOCKET_EVENTS.CUSTOMER_JOIN_QUEUE, async (data) => {
      const { salonId } = data;
      
      try {
        // Fetch fresh data and broadcast (HTTP request already updated database)
        const salon = await Salon.findById(salonId).populate({
          path: 'queue',
          select: 'username email'
        });
        
        if (salon) {
          io.to(`salon_${salonId}`).emit(SOCKET_EVENTS.QUEUE_UPDATED, salon.queue);
        }
      } catch (error) {
        console.error("❌ Join queue broadcast error:", error);
      }
    });

    // ✅ FIXED: Just broadcast fresh data (HTTP already updated DB)  
    socket.on(SOCKET_EVENTS.BARBER_UPDATE_QUEUE, async (data) => {
      const { salonId, action } = data;
      
      try {
        // Fetch fresh data and broadcast (your addWalkInClient already updated database)
        const salon = await Salon.findById(salonId).populate({
          path: 'queue',
          select: 'username email'
        });
        
        if (salon) {
          io.to(`salon_${salonId}`).emit(SOCKET_EVENTS.QUEUE_UPDATED, salon.queue);
        }
      } catch (error) {
        console.error("❌ Barber update broadcast error:", error);
      }
    });

    // Keep your working leave queue handler
    socket.on(SOCKET_EVENTS.CUSTOMER_LEAVE_QUEUE, async (data) => {
      const { salonId, userId } = data;
      try {
        const updatedQueue = await removeFromQueue(salonId, userId);
        io.to(`salon_${salonId}`).emit(SOCKET_EVENTS.QUEUE_UPDATED, updatedQueue);
      } catch (error) {
        console.error("❌ Leave queue error:", error);
      }
    });

    socket.on('disconnect', () => {
    });
  });
};

module.exports = { handleSocketConnections };
