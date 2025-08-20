const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "barber", "admin"],
    default: "user",
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salon" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//bcrypt hash password

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    next();
  }

  try {
    const salRound = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salRound);
    user.password = hash;
  } catch (error) {
    next(error);
  }
});

//compare password

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

//JWT(Json web Token)

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        phone: this.phone,
        role: this.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "60d" }
    );
  } catch (error) {
    console.error(error);
  }
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
