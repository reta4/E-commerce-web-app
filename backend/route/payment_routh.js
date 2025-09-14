import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import dotenv from "dotenv";
//..............................................................

dotenv.config();

const router = express.Router();
import {
  create_ceckout_session,
  checkout_success,
} from "../controles/payment_controller.js";

router.post("/create-checkout-session", protectRoute, create_ceckout_session);
router.post("/checkout_success", protectRoute, checkout_success);

export default router;
