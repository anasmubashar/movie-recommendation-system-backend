import Movie from "../models/Movie.js";

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("director cast");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("director cast");
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    }).populate("director cast");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const filterMovies = async (req, res) => {
  try {
    const { genre, minRating, maxYear } = req.query;
    let filter = {};

    if (genre) filter.genre = genre;
    if (minRating) filter.averageRating = { $gte: parseFloat(minRating) };
    if (maxYear) filter.releaseDate = { $lte: new Date(maxYear, 11, 31) };

    const movies = await Movie.find(filter).populate("director cast");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
