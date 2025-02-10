import express from "express";
import { roomController } from "../controllers/index.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const roomRoute = express.Router();

roomRoute.get("/", roomController.getAllRoom);
roomRoute.get(
  "/all",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  roomController.getAllAdminRoom
);
roomRoute.put("/amount", roomController.updateRoomAmount);

roomRoute.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  roomController.createRoom
);
roomRoute.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  roomController.updateRoom
);
roomRoute.get("/byhotel/:id", roomController.getAllRoomByHotel);
roomRoute.get("/:id", roomController.getRoom);
roomRoute.get("/:id", roomController.updateRoom); // change disable // enable product
roomRoute.get("/:categoryId", roomController.roomsByHotel);
export default roomRoute;
