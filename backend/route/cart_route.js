import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import {
  get_cart_products,
  add_to_cart,
  deleteFromCart,
  update_quantity,
  deleteAll,
} from "../controles/cart_controller.js";
//..............................................................

const router = express.Router();

router.get("/", protectRoute, get_cart_products);
router.post("/", protectRoute, add_to_cart);
router.delete("/", protectRoute, deleteFromCart);
router.delete("/delete-cart", protectRoute, deleteAll);
router.put("/:id", protectRoute, update_quantity);

export default router;
