import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    desc: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      lng: {
        // longest
        type: Number,
        required: true,
      },
      lat: {
        // latitude
        type: Number,
        required: true,
      },
    },
    rate: {
      type: String,
      required: true,
      default: "0",
    },
    tag: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    extra: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const HotelModel = mongoose.model("Hotel", hotelSchema);
export default HotelModel;
