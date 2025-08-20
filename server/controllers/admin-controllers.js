const Salon = require("../models/salon-model");
const User = require("../models/user-model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

const getAllSalons = async (req, res) => {
  try {
    const salons = await Salon.find().populate("barbers", "username email");
    res.json(salons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching salons", error: err.message });
  }
};

const deleteSalonById = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndDelete(req.params.id);
    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }
    res.json({ message: "Salon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting salon", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUserById,
  getAllSalons,
  deleteSalonById,
};
