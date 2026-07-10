require("dotenv").config();
const express= require('express')
const app=express()
app.use(express.json());

const PORT = process.env.PORT || 3000;
const connectDB= require("./config/db");
const { connect } = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.get("/", (req, res) => {
  console.log("GET / request received");
  res.send("Backend is working!");
});


connectDB(); //this will connect my database. 

console.log("Before app.listen");

app.listen(8081, '0.0.0.0', () => {
  console.log("Server is listening on port 8081");
}); 