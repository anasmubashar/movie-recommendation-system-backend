import User from "../models/User.js";
import Movie from "../models/Movie.js";

export const updateProfile = async (req, res) => {
  try {
    const { favoriteGenres, favoriteActors } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { favoriteGenres, favoriteActors } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(movieId)) {
      user.wishlist.push(movieId);
      await user.save();
    }
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCustomList = async (req, res) => {
  try {
    const { name, movies } = req.body;
    const user = await User.findById(req.user.id);
    user.customLists.push({ name, movies });
    await user.save();
    res.json(user.customLists);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const followList = async (req, res) => {
  try {
    const { listId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.followedLists.includes(listId)) {
      user.followedLists.push(listId);
      await user.save();
    }
    res.json(user.followedLists);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
