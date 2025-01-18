import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get personalized recommendations for the authenticated user
router.get("/", authenticateJWT, getRecommendations);

export default router;
