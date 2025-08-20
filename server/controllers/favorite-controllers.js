const User = require("../models/user-model");

const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params; // get id from route params

    // Find user by id and populate favorites with salon details
    const user = await User.findById(userId).populate({
      path: "favorites",
      select: "name address phone openingHour barbers createdAt",
      populate: {
        path: "barbers",
        select: "username",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ favorites: user.favorites || [] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching favorites", error: err.message });
  }
};

// Add a salon to user's favorites
const addFavorite = async (req, res) => {
  try {
    const userId = req.params.userId;
    const salonId = req.params.salonId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.favorites.includes(salonId)) {
      return res.status(400).json({ message: "Salon already in favorites" });
    }

    user.favorites.push(salonId);
    await user.save();

    res
      .status(200)
      .json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a salon from user's favorites
const removeFavorite = async (req, res) => {
  try {
    const userId = req.params.userId;
    const salonId = req.params.salonId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== salonId
    );
    await user.save();

    res
      .status(200)
      .json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
