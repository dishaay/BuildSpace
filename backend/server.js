require("dotenv").config();
const express= require('express')
const app=express()
const PORT = process.env.PORT || 3000;
const connectDB= require("./config/db");
const { connect } = require("mongoose");
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("GET / request received");
  res.send("Backend is working!");
});


connectDB(); //this will connect my database. 

console.log("Before app.listen");

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

console.log("After app.listen");