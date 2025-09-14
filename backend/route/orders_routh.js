import express from "express";

const router = express.Router();
import { getOrders } from "../controles/orders_controlles.js";
import { protectRoute } from "../middleware/auth_middleware.js";

router.get("/:id", protectRoute, getOrders);

export default router;
