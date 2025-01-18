import express from "express";
import {
  getAllDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addComment,
  likeDiscussion,
} from "../controllers/disscussionController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllDiscussions);
router.get("/:id", getDiscussionById);
router.post("/", authenticateJWT, createDiscussion);
router.put("/:id", authenticateJWT, updateDiscussion);
router.delete("/:id", authenticateJWT, deleteDiscussion);
router.post("/:id/comments", authenticateJWT, addComment);
router.post("/:id/like", authenticateJWT, likeDiscussion);

export default router;
