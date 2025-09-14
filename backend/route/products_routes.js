import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth_middleware.js";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getReconditionsProducts,
  getProductsbycategory,
  toggle_featuredProducts,
} from "../controles/products_controler.js";
//..............................................................
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsbycategory);
router.get("/reconditions", getReconditionsProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggle_featuredProducts);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
