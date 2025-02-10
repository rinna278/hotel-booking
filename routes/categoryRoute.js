import express from "express";
import { categoryController } from "../controllers/index.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const categoryRoute = express.Router();

categoryRoute.get("/", categoryController.getCategories);
categoryRoute.get(
  "/all",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  categoryController.getAllCategory
);
categoryRoute.get("/:id", categoryController.updateCategoryStatus);
categoryRoute.delete("/:id", categoryController.deleteCategory);

categoryRoute.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  categoryController.createCategory
);

categoryRoute.get("/:id", categoryController.getCategoryId);

categoryRoute.put(
  "/edit/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  categoryController.updateCategoryId
);

export default categoryRoute;
