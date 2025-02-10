import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.put("/me/update", isAuthenticatedUser, userController.updateUser);
userRouter.get(
  "/count-user",
  isAuthenticatedUser,
  authorizeRoles("admin"),

  userController.getCountAllUser
);

userRouter.post("/change-password", userController.forgotPassword);
userRouter.get(
  "/admin/countuser",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getAllUser
);

userRouter.get("/me/:id", isAuthenticatedUser, userController.getUserDetails);
userRouter.put(
  "/password/update",
  isAuthenticatedUser,
  userController.updatePassword
);
userRouter.put("/password/reset/:token", userController.resetPassword);
userRouter.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getOneUser
);

userRouter.patch(
  "/admin/user/updatestatus/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.updateUserStatus
);
export default userRouter;
