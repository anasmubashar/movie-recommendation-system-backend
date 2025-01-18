import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendNewReleaseNotification = async (user, movie) => {
  const subject = `New Release: ${movie.title}`;
  const html = `
    <h1>New Movie Release</h1>
    <p>Hello ${user.username},</p>
    <p>A new movie that matches your preferences has been released:</p>
    <h2>${movie.title}</h2>
    <p>Release Date: ${movie.releaseDate}</p>
    <p>Genre: ${movie.genre.join(", ")}</p>
    <p>Synopsis: ${movie.synopsis}</p>
    <p>Check it out on our platform!</p>
  `;
  await sendEmail(user.email, subject, html);
};

export const sendWeeklyRecommendations = async (user, movies) => {
  const subject = "Your Weekly Movie Recommendations";
  const html = `
    <h1>Weekly Movie Recommendations</h1>
    <p>Hello ${user.username},</p>
    <p>Here are your personalized movie recommendations for this week:</p>
    <ul>
      ${movies
        .map(
          (movie) => `
        <li>
          <h3>${movie.title}</h3>
          <p>Genre: ${movie.genre.join(", ")}</p>
          <p>Average Rating: ${movie.averageRating.toFixed(1)}</p>
        </li>
      `
        )
        .join("")}
    </ul>
    <p>Enjoy watching!</p>
  `;
  await sendEmail(user.email, subject, html);
};
