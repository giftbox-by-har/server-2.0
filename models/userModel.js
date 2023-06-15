const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phonenumber: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["Admin", "Buyer"],
      default: "Buyer",
    },
    address: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Laki-Laki", "Perempuan"],
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
