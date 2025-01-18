import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

export const addReview = async (req, res) => {
  try {
    const { movieId, rating, content } = req.body;
    const newReview = new Review({
      user: req.user.id,
      movie: movieId,
      rating,
      content,
    });
    await newReview.save();

    // Update movie's average rating
    const movie = await Movie.findById(movieId);
    const reviews = await Review.find({ movie: movieId });
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    movie.averageRating = avgRating;
    await movie.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movie: movieId }).populate(
      "user",
      "username"
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, content } = req.body;
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, user: req.user.id },
      { $set: { rating, content } },
      { new: true }
    );
    if (!updatedReview) {
      return res
        .status(404)
        .json({ message: "Review not found or unauthorized" });
    }
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
