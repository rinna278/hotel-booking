import express from "express";
import { orderController } from "../controllers/index.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const orderRoute = express.Router();
orderRoute.post("/", isAuthenticatedUser, orderController.createOrder);
orderRoute.get(
  "/",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.getAllOrder
);
orderRoute.get(
  "/metwo/:id",
  isAuthenticatedUser,
  orderController.getLatestTwoOrdersByUserId
);

orderRoute.get(
  "/month/caltulate",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.calculateMonthlyRevenue
);
orderRoute.get(
  "/week/caltulate",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.calculateWeeklyRevenue
);
orderRoute.post(
  "/day/caltulate/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.calculateDaylyRevenue
);

orderRoute.get(
  "/month/caltulate/:id",
  isAuthenticatedUser,
  authorizeRoles("hotelier"),
  authorizeRoles("admin"),
  orderController.calculateMonthlyRevenueByHotelId
);

orderRoute.get(
  "/week/caltulate/:id",
  isAuthenticatedUser,
  authorizeRoles("hotelier"),
  authorizeRoles("admin"),
  orderController.calculateWeeklyRevenueByHotel
);

orderRoute.get("/me/:id", isAuthenticatedUser, orderController.myOrders);
orderRoute.get(
  "/me/order-pending/:id",
  isAuthenticatedUser,
  orderController.getOrderPending
);

orderRoute.get("/:id", isAuthenticatedUser, orderController.getOneOrder);
orderRoute.put(
  "/change-status/:id",
  isAuthenticatedUser,
  authorizeRoles("hotelier"),
  authorizeRoles("admin"),
  orderController.updateStatusOrder
);
orderRoute.get("/cancel/:id", isAuthenticatedUser, orderController.cancelOrder);

export default orderRoute;
