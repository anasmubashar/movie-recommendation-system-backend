import express from "express";
import {
  getMovies,
  getMovieById,
  searchMovies,
  filterMovies,
} from "../controllers/movieController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/search", searchMovies);
router.get("/filter", filterMovies);
router.get("/:id", getMovieById);

export default router;
