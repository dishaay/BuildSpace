//this db.js will store the file that connects to my database
const mongoose = require("mongoose");

const connectDB = async () => {

  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb is connected")
  }
  catch(err){
    console.log(err)
    process.exit(1);
  }
};

module.exports = connectDB;