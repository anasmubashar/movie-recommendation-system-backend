import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

export const getRecommendations = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userRatings = await Review.find({ user: userId });

    // Find similar users based on genre preferences and ratings
    const similarUsers = await User.find({
      _id: { $ne: userId },
      favoriteGenres: { $in: user.favoriteGenres },
    });

    const similarUserIds = similarUsers.map((u) => u._id);
    const similarUserRatings = await Review.find({
      user: { $in: similarUserIds },
    });

    // Calculate movie scores based on similar users' ratings
    const movieScores = {};
    similarUserRatings.forEach((rating) => {
      if (!movieScores[rating.movie]) {
        movieScores[rating.movie] = { score: 0, count: 0 };
      }
      movieScores[rating.movie].score += rating.rating;
      movieScores[rating.movie].count += 1;
    });

    // Calculate average scores and filter out movies the user has already rated
    const userRatedMovies = userRatings.map((r) => r.movie.toString());
    const recommendedMovies = Object.entries(movieScores)
      .filter(([movieId]) => !userRatedMovies.includes(movieId))
      .map(([movieId, data]) => ({
        movie: movieId,
        score: data.score / data.count,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Fetch full movie details for recommended movies
    const recommendations = await Movie.find({
      _id: { $in: recommendedMovies.map((r) => r.movie) },
    }).populate("director cast");

    return recommendations;
  } catch (error) {
    console.error("Error in recommendation service:", error);
    throw error;
  }
};
