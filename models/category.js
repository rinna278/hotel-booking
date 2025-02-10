import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    images: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
