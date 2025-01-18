import express from "express";
import {
  addReview,
  getMovieReviews,
  updateReview,
} from "../controllers/reviewController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateJWT, addReview);
router.get("/movie/:movieId", getMovieReviews);
router.put("/:reviewId", authenticateJWT, updateReview);

export default router;
