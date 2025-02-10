import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      name: { type: String, required: true, default: "Order no name" },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        require: true,
      },
    },
  ],
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    require: true,
  },
  status: {
    type: String,
    require: true,
    default: "Pending...",
  },
  payment: {
    type: String,
    required: true,
    default: "Khi hoàn thành",
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },

  dateCheckin: {
    type: Date,
    require: true,
  },
  dateCheckout: {
    type: Date,
    require: true,
  },
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
