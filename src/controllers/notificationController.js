import User from "../models/User.js";
import Movie from "../models/Movie.js";
import { sendNewReleaseNotification } from "../services/emailService.js";

export const sendNotifications = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required." });
    }

    // Find the movie
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    // Find users with the role 'user' and matching genres
    const users = await User.find({
      role: "user",
    });

    // Send notifications
    const emailPromises = users.map((user) =>
      sendNewReleaseNotification(user, movie)
    );
    await Promise.all(emailPromises);

    res.status(200).json({ message: "Notifications sent successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending notifications.", error: error.message });
  }
};
