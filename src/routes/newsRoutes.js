import express from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllNews);
router.get("/:id", getNewsById);

// Admin-only routes
router.post("/", authenticateJWT, isAdmin, createNews);
router.put("/:id", authenticateJWT, isAdmin, updateNews);
router.delete("/:id", authenticateJWT, isAdmin, deleteNews);

export default router;
