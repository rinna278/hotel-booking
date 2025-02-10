import cloundinary from "cloudinary";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utills/errorHandle.js";
import { CategoryModel, UserModel } from "../models/index.js";

export const getCategories = catchAsyncError(async (req, res, next) => {
  const categories = await CategoryModel.find().where({ status: false });
  const categoriesCount = await CategoryModel.count();

  res.status(200).json({
    categories,
    message: "get categories successfully",
    success: true,
    categoriesCount,
  });
});
export const getAllCategory = catchAsyncError(async (req, res, next) => {
  const categories = await CategoryModel.find();
  const categoriesCount = await CategoryModel.count();

  res.status(200).json({
    categories,
    message: "get all categories successfully",
    success: true,
    categoriesCount,
  });
});
export const createCategory = catchAsyncError(async (req, res, next) => {
  const userId = req.user;
  const user = await UserModel.find(userId);
  if (!user) return next(new ErrorHandler("Not found user...", 404));
  const categories = req.body.categories;

  const newCategories = [];

  for (const category of categories) {
    const newCategory = await CategoryModel.create({
      user: user._id,
      title: category.title,
    });

    newCategories.push(newCategory);
  }

  res.status(200).json({
    newCategories,
    success: true,
    message: "Create category successfully!!!",
  });
});
export const getCategoryId = catchAsyncError(async (req, res, next) => {
  const categoryId = await CategoryModel.findById(req.params.id).select(
    "-user"
  );
  if (!categoryId) return next(new ErrorHandler("Create new category...", 400));

  res.status(200).json({
    categoryId,
    success: true,
    message: "Get category id successfully!!!",
  });
});
export const updateCategoryId = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const category = await CategoryModel.findById(req.params.id).select("-user");
  if (!category) return next(new ErrorHandler("Category not found", 404));

  const updateCategory = await CategoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    updateCategory,
    message: "update category success",
  });
});
export const deleteCategory = catchAsyncError(async (req, res, next) => {
  const categoryId = await CategoryModel.findById(req.params.id);
  if (!categoryId) return next(new ErrorHandler("Not found category...", 404));

  const category = await CategoryModel.findByIdAndDelete(categoryId.id);

  res.status(200).json({
    success: true,
    message: "deleted category success",
  });
});
export const updateCategoryStatus = catchAsyncError(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Not found", 404));
  }

  category.status = !category.status; // change status

  await category.save();

  res.status(200).json({
    category,
    success: true,
  });
});
