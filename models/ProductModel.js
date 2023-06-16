const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter your name"],
      // unique: [true, "Product already existing"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Enter your description"],
      trim: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    price: {
      type: Number,
      required: [true, "Enter your price"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Enter your password"],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const ProductModel = new mongoose.model("products", ProductSchema);

module.exports = ProductModel;
