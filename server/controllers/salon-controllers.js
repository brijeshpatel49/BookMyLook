const Salon = require("../models/salon-model");
const User = require("../models/user-model");
const cron = require("node-cron");

const generateRandomEmail = () => {
  const randomStr = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now();
  return `walkin_${randomStr}_${timestamp}@example.com`;
};

cron.schedule("0 0 * * *", async () => {
  try {
    await Salon.updateMany({}, { $set: { queue: [] } });
    console.log("Queues cleared at midnight");
  } catch (err) {
    console.error("Queue reset error:", err);
  }
});

const createSalon = async (req, res) => {
  try {
    const { name, address, phone, openingHour, barbers } = req.body;
    const salon = new Salon({ name, address, phone, openingHour, barbers });
    await salon.save();
    res.status(201).json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSalons = async (req, res) => {
  const salons = await Salon.find()
    .populate("barbers", "username email")
    .populate("queue", "username email");
  res.json(salons);
};

const getSalon = async (req, res) => {
  const salon = await Salon.findById(req.params.id)
    .populate("barbers", "username email")
    .populate("queue", "username email");
  if (!salon) return res.status(404).json({ message: "Salon not found" });
  res.json(salon);
};

const updateSalon = async (req, res) => {
  try {
    const { salonId } = req.params;
    const { name, address, phone, openingHour } = req.body;

    const salon = await Salon.findById(salonId);
    if (!salon) return res.status(404).json({ message: "Salon not found" });

    salon.name = name || salon.name;
    salon.address = address || salon.address;
    salon.phone = phone || salon.phone;
    salon.openingHour = openingHour || salon.openingHour;

    await salon.save();
    res.status(200).json(salon);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getSalonByBarber = async (req, res) => {
  const { id } = req.params;
  const salon = await Salon.findOne({ barbers: id })
    .populate("barbers", "username email")
    .populate("queue", "username email");
  if (!salon)
    return res.status(404).json({ message: "Salon not found for this barber" });
  res.json(salon);
};

const addToQueue = async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  const { userId } = req.body;

  const existingQueue = await Salon.findOne({
    queue: { $in: [userId] },
  });

  if (!salon.isOpen)
    return res
      .status(400)
      .json({ message: "Queue is currently held. Salon is closed." });

  if (existingQueue) {
    return res.status(400).json({
      message: `You are already in a queue at ${existingQueue.name}. Please cancel your current queue first.`,
    });
  }

  if (!salon) return res.status(404).json({ message: "Salon not found" });
  if (salon.queue.includes(userId))
    return res.status(400).json({ message: "User is already in queue" });
  salon.queue.push(userId);
  await salon.save();

  const updatedSalon = await Salon.findById(salon._id).populate(
    "queue",
    "username email"
  );
  res.json({ queue: updatedSalon.queue });
};

const removeFromQueue = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    const { userId } = req.params;
    const userToRemove = await User.findById(userId);
    if (!salon) return res.status(404).json({ message: "Salon not found" });

    salon.queue = salon.queue.filter((id) => id.toString() !== userId);
    if (userToRemove.email && userToRemove.email.startsWith("walkin")) {
      await User.findByIdAndDelete(userId);
    }
    await salon.save();

    const populatedSalon = await Salon.findById(req.params.id).populate(
      "queue",
      "username"
    );
    res.json({ queue: populatedSalon.queue });
  } catch (err) {
    console.error("Error removing from queue:", err);
    res
      .status(500)
      .json({ message: "Failed to remove from queue", error: err.message });
  }
};

const getQueue = async (req, res) => {
  const salon = await Salon.findById(req.params.id).populate(
    "queue",
    "username email"
  );
  if (!salon) return res.status(404).json({ message: "Salon not found" });
  res.json({ queue: salon.queue });
};

const addWalkInClient = async (req, res) => {
  try {
    const { salonId } = req.params;
    const salon = await Salon.findById(salonId);
    if (!salon) return res.status(404).json({ message: "Salon not found" });

    const walkInUser = await User.create({
      username: `Walk-in`,
      role: "user",
      email: generateRandomEmail(),
      phone: "",
      password: "",
    });

    salon.queue.push(walkInUser._id);
    await salon.save();

    // Populate queue for frontend
    const updatedSalon = await Salon.findById(salonId).populate(
      "queue",
      "username email"
    );
    res.json({ queue: updatedSalon.queue });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Could not add walk-in", error: err.message });
  }
};

const checkUserInAnyQueue = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find any salon where this user is in the queue
    const salonWithUser = await Salon.findOne({
      queue: { $in: [userId] },
    }).populate("queue", "username email");

    if (salonWithUser) {
      res.json({
        inQueue: true,
        salonId: salonWithUser._id,
        salonName: salonWithUser.name,
        queuePosition:
          salonWithUser.queue.findIndex(
            (user) => user._id.toString() === userId
          ) + 1,
      });
    } else {
      res.json({
        inQueue: false,
      });
    }
  } catch (error) {
    console.error("Check queue status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOpenStatus = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.salonId);
    if (!salon) return res.status(404).json({ message: "Salon not found" });

    salon.isOpen = req.body.isOpen;
    await salon.save();

    res.json({ isOpen: salon.isOpen });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSalon,
  getSalons,
  getSalon,
  getSalonByBarber,
  addToQueue,
  removeFromQueue,
  getQueue,
  updateSalon,
  addWalkInClient,
  checkUserInAnyQueue,
  updateOpenStatus,
};
