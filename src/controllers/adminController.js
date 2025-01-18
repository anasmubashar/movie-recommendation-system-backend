import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

export const addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: `Server error ${error}` });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action } = req.body; // 'approve' or 'delete'

    if (action === "approve") {
      await Review.findByIdAndUpdate(reviewId, { $set: { isApproved: true } });
      res.json({ message: "Review approved" });
    } else if (action === "delete") {
      await Review.findByIdAndDelete(reviewId);
      res.json({ message: "Review deleted" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSiteStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();
    const topRatedMovies = await Movie.find().sort("-averageRating").limit(10);
    const mostActiveUsers = await User.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "user",
          as: "reviews",
        },
      },
      { $project: { username: 1, reviewCount: { $size: "$reviews" } } },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      totalUsers,
      totalMovies,
      totalReviews,
      topRatedMovies,
      mostActiveUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
