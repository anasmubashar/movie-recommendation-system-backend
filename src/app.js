import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

import { authenticateJWT } from "./middleware/authMiddleware.js";
import { startCronJobs } from "./services/cronService.js";
import cookieParser from "cookie-parser";
import notificationRoutes from "./routes/notificationRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import awardRoutes from "./routes/awardRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(cookieParser());

app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", authenticateJWT, userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/recommendations", authenticateJWT, recommendationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/awards", awardRoutes);

startCronJobs();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
