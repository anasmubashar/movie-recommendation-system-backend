import cron from "node-cron";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import { getRecommendations } from "./recommendationService.js";
import { sendWeeklyRecommendations } from "./emailService.js";

const updateTrendingMovies = async () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const trendingMovies = await Review.aggregate([
    { $match: { createdAt: { $gte: oneWeekAgo } } },
    { $group: { _id: "$movie", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const trendingMovieIds = trendingMovies.map((m) => m._id);
  await Movie.updateMany(
    { _id: { $in: trendingMovieIds } },
    { $set: { isTrending: true } }
  );
  await Movie.updateMany(
    { _id: { $nin: trendingMovieIds } },
    { $set: { isTrending: false } }
  );
};

const sendWeeklyRecommendationsToUsers = async () => {
  const users = await User.find();
  for (const user of users) {
    const recommendations = await getRecommendations(user._id);
    await sendWeeklyRecommendations(user, recommendations.slice(0, 5));
  }
};

export const startCronJobs = () => {
  // Update trending movies daily at midnight
  cron.schedule("0 0 * * *", updateTrendingMovies);

  // Send weekly recommendations every Monday at 9 AM
  cron.schedule("0 9 * * 1", sendWeeklyRecommendationsToUsers);
};
