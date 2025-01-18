import Discussion from "../models/Discussion.js";

export const getAllDiscussions = async (req, res) => {
  try {
    const { movie, genre, actor } = req.query;
    let query = {};
    if (movie) query.movie = movie;
    if (genre) query.genre = genre;
    if (actor) query.actor = actor;

    const discussions = await Discussion.find(query)
      .populate("author", "username")
      .populate("movie", "title")
      .populate("actor", "name")
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching discussions" });
  }
};

export const getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate("author", "username")
      .populate("movie", "title")
      .populate("actor", "name")
      .populate("comments.author", "username");
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Error fetching discussion" });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { title, content, movie, genre, actor } = req.body;
    const newDiscussion = new Discussion({
      title,
      content,
      author: req.user.id,
      movie,
      genre,
      actor,
    });
    await newDiscussion.save();
    res.status(201).json(newDiscussion);
  } catch (error) {
    res.status(500).json({ message: "Error creating discussion" });
  }
};

export const updateDiscussion = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedDiscussion = await Discussion.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { title, content },
      { new: true }
    );
    if (!updatedDiscussion) {
      return res
        .status(404)
        .json({ message: "Discussion not found or unauthorized" });
    }
    res.json(updatedDiscussion);
  } catch (error) {
    res.status(500).json({ message: "Error updating discussion" });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const deletedDiscussion = await Discussion.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!deletedDiscussion) {
      return res
        .status(404)
        .json({ message: "Discussion not found or unauthorized" });
    }
    res.json({ message: "Discussion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting discussion" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    discussion.comments.push({
      content,
      author: req.user.id,
    });
    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

export const likeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    if (discussion.likes.includes(req.user.id)) {
      discussion.likes = discussion.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      discussion.likes.push(req.user.id);
    }
    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Error liking discussion" });
  }
};
