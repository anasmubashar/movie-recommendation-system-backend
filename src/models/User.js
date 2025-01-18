import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: String,
  favoriteGenres: [String],
  favoriteActors: [String],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  customLists: [
    {
      name: String,
      movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    },
  ],
  followedLists: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User.customLists" },
  ],
  role: { type: String, default: "user", enum: ["user", "admin"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.password.startsWith("$2a$")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
