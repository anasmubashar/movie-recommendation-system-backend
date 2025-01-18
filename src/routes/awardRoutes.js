import express from "express";
import {
  getMovieAwards,
  addMovieAward,
  updateAward,
  deleteAward,
} from "../controllers/awardController.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/movies/:movieId", getMovieAwards);

// Admin-only routes
router.post("/movies/:movieId", authenticateJWT, isAdmin, addMovieAward);
router.put("/:awardId", authenticateJWT, isAdmin, updateAward);
router.delete("/:awardId", authenticateJWT, isAdmin, deleteAward);

export default router;
