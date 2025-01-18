import express from "express";
import {
  updateProfile,
  addToWishlist,
  createCustomList,
  followList,
} from "../controllers/userController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", authenticateJWT, updateProfile);
router.post("/wishlist", authenticateJWT, addToWishlist);
router.post("/custom-list", authenticateJWT, createCustomList);
router.post("/follow-list", authenticateJWT, followList);

export default router;
