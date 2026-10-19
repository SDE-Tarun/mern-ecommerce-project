
import express from "express";
import {
  placeorder,
  getAllOrders,
  updateOrderStatus,
  getMyOrders,
} from "../controllers/orderController.js";

import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

// Customer checkout
orderRouter.post(
  "/order-placed",
  authenticateToken,
  placeorder
);

// Admin order management
orderRouter.get(
  "/",
  authenticateToken,
  requireAdmin,
  getAllOrders
);

orderRouter.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  updateOrderStatus
);

orderRouter.get("/my-orders", authenticateToken, getMyOrders);

export default orderRouter;
