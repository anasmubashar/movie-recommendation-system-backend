import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  genre: String,
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      content: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Discussion = mongoose.model("Discussion", discussionSchema);

export default Discussion;
