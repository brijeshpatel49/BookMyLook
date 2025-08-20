const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  openingHour: { type: String },
  barbers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  queue: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  isOpen: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Salon", salonSchema);
