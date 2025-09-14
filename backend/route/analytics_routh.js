import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth_middleware.js";
import { get_analytics_data } from "../controles/analytics_controller.js";
//..............................................................

const router = express.Router();
router.get("/", protectRoute, adminRoute, get_analytics_data);
export default router;
