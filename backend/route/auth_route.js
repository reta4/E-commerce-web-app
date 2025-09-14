import expres from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controles/auth_controler.js";
import { protectRoute } from "../middleware/auth_middleware.js";
//..............................................................
const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);
router.post("/forgot-pass", forgotPassword);
router.post("/reset", resetPassword);

export default router;
