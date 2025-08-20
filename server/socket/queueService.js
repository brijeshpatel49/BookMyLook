// socket/queueService.js - Complete fix
const Salon = require("../models/salon-model");
const User = require("../models/user-model");

const addToQueue = async (salonId, userId) => {
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) {
      throw new Error("Salon not found");
    }

    // ✅ CRITICAL FIX: Clean and filter queue completely
    salon.queue = salon.queue.filter((client) => {
      // Remove null, undefined, empty objects
      if (!client) return false;

      // Remove entries without valid _id
      if (!client._id) return false;

      // Check if _id is a valid ObjectId string
      const mongoose = require("mongoose");
      if (!mongoose.Types.ObjectId.isValid(client._id)) return false;

      return true;
    });

    // ✅ SAFE duplicate check with proper error handling
    const isAlreadyInQueue = salon.queue.some((client) => {
      try {
        // Extra safety check
        if (!client || !client._id || !userId) return false;

        const clientId = client._id.toString();
        const userIdString = userId.toString();

        return clientId === userIdString;
      } catch (error) {
        console.error("Error in duplicate check:", error);
        return false; // Skip problematic entries
      }
    });

    if (isAlreadyInQueue) {
      throw new Error("User already in queue");
    }

    // Add user to queue
    salon.queue.push({ _id: userId });

    // Save with cleaned queue
    await salon.save();

    // Populate and return
    await salon.populate({
      path: "queue",
      select: "username email",
    });

    return salon.queue;
  } catch (error) {
    console.error("addToQueue error:", error.message);
    throw error;
  }
};

const removeFromQueue = async (salonId, userId) => {
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) {
      throw new Error("Salon not found");
    }

    // ✅ SAFE filtering with error handling
    salon.queue = salon.queue.filter((client) => {
      try {
        if (!client || !client._id) return false;

        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(client._id)) return false;

        return client._id.toString() !== userId.toString();
      } catch (error) {
        console.error("Error in remove filter:", error);
        return false; // Remove problematic entries
      }
    });

    await salon.save();
    await salon.populate({
      path: "queue",
      select: "username email",
    });

    return salon.queue;
  } catch (error) {
    console.error("removeFromQueue error:", error);
    throw error;
  }
};

const addWalkInToQueue = async (salonId, walkInData = {}) => {
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) {
      throw new Error("Salon not found");
    }

    // ✅ Create actual User document for walk-in (cleanest approach)
    const walkInUser = new User({
      username: walkInData.username || `Walk-in-${Date.now()}`,
      email: `walkin-${Date.now()}@temp.com`,
      password: "temp123",
      role: "user",
    });

    await walkInUser.save();

    // Add to queue as ObjectId reference
    salon.queue.push({ _id: walkInUser._id });
    await salon.save();

    await salon.populate({
      path: "queue",
      select: "username email",
    });

    return salon.queue;
  } catch (error) {
    console.error("addWalkInToQueue error:", error);
    throw error;
  }
};

module.exports = {
  addToQueue,
  removeFromQueue,
  addWalkInToQueue,
};
