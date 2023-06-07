const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// ======================= Schema for User Model ==================
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    Blocked: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: { type: String, default: "" },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    passwordResetToken: {
      type: String,
      default: " ",
    },
    passwordResetExpires: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

//==================== Encrypting Password using 'pre' hook that encrypt pass before saving user in db====================
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//====================== Schema Level Matching Password Method =====================

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPassResetToken = async function (email) {
  const resetToken = jwt.sign({ email }, process.env.JWT_KEY, {
    expiresIn: "10m",
  });
  const salt = await bcrypt.genSalt(10);
  this.passwordResetToken = await bcrypt.hash(resetToken, salt);
  this.passwordResetExpires = new Date().getTime() + 1 * 60 * 1000;
  return resetToken;
};

//========================== Export the model =====================
module.exports = mongoose.model("User", userSchema);
