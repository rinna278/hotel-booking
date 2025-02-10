import express from "express";
import userRouter from "./userRoute.js";
import categoryRouter from "./categoryRoute.js";
import roomRouter from "./roomRoute.js";
import orderRouter from "./orderRoute.js";
import hotelRouter from "./hotelRoute.js";
import authRouter from "./authRoute.js";

const router = express.Router();
router.use("/api/v1/user", userRouter);
router.use("/api/v1/category", categoryRouter);
router.use("/api/v1/room", roomRouter);
router.use("/api/v1/order", orderRouter);
router.use("/api/v1/hotel", hotelRouter);
router.use("/api/v1/auth", authRouter);

export default router;
