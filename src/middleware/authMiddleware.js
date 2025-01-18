import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        req.user = user;
        next();
      } else return res.json({ status: false });
    }
  });
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user.role);

    if (user && user.role === "admin") {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Access denied. Admin rights required." });
    }
  } catch (error) {
    console.error("Error in isAdmin:", error);
    res.status(500).json({ message: "Server error" });
  }
};
