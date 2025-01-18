import Movie from "../models/Movie.js";

export const getMovieAwards = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie.awards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movie awards" });
  }
};

export const addMovieAward = async (req, res) => {
  try {
    const { name, category, year, isNomination } = req.body;
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    movie.awards.push({ name, category, year, isNomination });
    await movie.save();
    res.status(201).json(movie.awards[movie.awards.length - 1]);
  } catch (error) {
    res.status(500).json({ message: "Error adding movie award" });
  }
};

export const updateAward = async (req, res) => {
  try {
    const { name, category, year, isNomination } = req.body;
    const movie = await Movie.findOne({ "awards._id": req.params.awardId });
    if (movie) {
      const award = movie.awards.id(req.params.awardId);
      award.set({ name, category, year, isNomination });
      await movie.save();
      return res.json(award);
    }
    const person = await Person.findOne({ "awards._id": req.params.awardId });
    if (person) {
      const award = person.awards.id(req.params.awardId);
      award.set({ name, category, year, isNomination });
      await person.save();
      return res.json(award);
    }
    res.status(404).json({ message: "Award not found" });
  } catch (error) {
    res.status(500).json({ message: "Error updating award" });
  }
};

export const deleteAward = async (req, res) => {
  try {
    const movie = await Movie.findOne({ "awards._id": req.params.awardId });
    if (movie) {
      movie.awards.id(req.params.awardId).remove();
      await movie.save();
      return res.json({ message: "Award deleted successfully" });
    }
    const person = await Person.findOne({ "awards._id": req.params.awardId });
    if (person) {
      person.awards.id(req.params.awardId).remove();
      await person.save();
      return res.json({ message: "Award deleted successfully" });
    }
    res.status(404).json({ message: "Award not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting award" });
  }
};
