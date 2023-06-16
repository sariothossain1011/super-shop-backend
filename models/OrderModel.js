const mongoose =require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const OrderSchema = new Schema(
  {
    products: [{ type: ObjectId, ref: "products" }],
    payment: {},
    buyer: { type: ObjectId, ref: "users" },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true, versionKey: false }
);

const OrderModel = mongoose.model("orders", OrderSchema);
module.exports = OrderModel;
