require("dotenv").config();
const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");
const { connect } = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const joinRequestRoutes = require("./routes/joinRequestRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const bookmarkRoutes =
    require(
        "./routes/bookmarkRoutes"
    );
const postRoutes = require("./routes/postRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/bookmarks",bookmarkRoutes);
app.use("/api/posts", postRoutes);


app.get("/", (req, res) => {
  console.log("GET / request received");
  res.send("Backend is working!");
});


connectDB(); //this will connect my database. 

console.log("Before app.listen");

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
});