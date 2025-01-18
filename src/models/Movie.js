import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],
  director: { type: String },
  cast: [{ type: String }],
  releaseDate: Date,
  runtime: Number,
  synopsis: String,
  averageRating: { type: Number, default: 0 },
  ageRating: String,
  parentalGuidance: String,
  trivia: [String],
  goofs: [String],
  soundtrack: [
    {
      title: String,
      artist: String,
    },
  ],
  boxOffice: {
    openingWeekend: Number,
    totalEarnings: Number,
    internationalRevenue: Number,
  },
  awards: [
    {
      name: String,
      category: String,
      year: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
