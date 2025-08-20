// services/queueService.js
const Salon = require('../models/salon-model'); // Adjust path to your salon model

const addToQueue = async (salonId, userId) => {
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) {
      throw new Error('Salon not found');
    }

    // Check if user is already in queue
    const isAlreadyInQueue = salon.queue.some(client => client._id.toString() === userId);
    if (isAlreadyInQueue) {
      throw new Error('User already in queue');
    }

    // Add user to queue
    salon.queue.push({ _id: userId });
    await salon.save();

    // Populate and return updated queue
    await salon.populate('queue', 'username email');
    return salon.queue;
  } catch (error) {
    throw error;
  }
};

const removeFromQueue = async (salonId, userId) => {
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) {
      throw new Error('Salon not found');
    }

    // Remove user from queue
    salon.queue = salon.queue.filter(client => client._id.toString() !== userId);
    await salon.save();

    // Populate and return updated queue
    await salon.populate('queue', 'username email');
    return salon.queue;
  } catch (error) {
    throw error;
  }
};

const updateSalonQueue = async (salonId, newQueue) => {
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) {
      throw new Error('Salon not found');
    }

    salon.queue = newQueue;
    await salon.save();
    
    await salon.populate('queue', 'username email');
    return salon.queue;
  } catch (error) {
    throw error;
  }
};

const addWalkInToQueue = async (salonId, walkInData = {}) => {
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) {
      throw new Error('Salon not found');
    }

    // Create walk-in client object
    const walkInClient = {
      username: walkInData.username || `Walk-in ${Date.now()}`,
      isWalkIn: true,
      joinedAt: new Date()
    };

    salon.queue.push(walkInClient);
    await salon.save();

    await salon.populate('queue', 'username email');
    return salon.queue;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addToQueue,
  removeFromQueue,
  updateSalonQueue,
  addWalkInToQueue
};
