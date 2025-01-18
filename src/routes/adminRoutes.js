import express from "express";
import {
  addMovie,
  updateMovie,
  deleteMovie,
  moderateReview,
  getSiteStatistics,
} from "../controllers/adminController.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateJWT, isAdmin);

router.post("/movies", addMovie);
router.put("/movies/:id", updateMovie);
router.delete("/movies/:id", deleteMovie);
router.post("/reviews/:reviewId/moderate", moderateReview);
router.get("/statistics", getSiteStatistics);

export default router;
