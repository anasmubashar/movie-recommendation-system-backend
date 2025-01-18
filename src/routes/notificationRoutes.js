import express from "express";
import { sendNotifications } from "../controllers/notificationController.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateJWT, isAdmin, sendNotifications);

export default router;
