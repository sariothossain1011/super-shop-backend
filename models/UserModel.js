const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      trim: true,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Enter your password"],
      trim: true,
    }
  },
  { timestamps: true, versionKey: false }
);

const UserModel = new mongoose.model("users", UserSchema);

module.exports = UserModel;
