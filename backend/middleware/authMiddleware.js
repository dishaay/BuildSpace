const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async(req,res,next)=>{
  try{
  const authHeader= req.headers.authorization;
  console.log(authHeader); // will print undefined. 

  if(!authHeader){
    return res.status(401).json({
      message: "Access denied. No token provided"
    })
  } // we need to make sure that the header even exists before storing it in the token. never use something before checking that it exists. 

  const parts= authHeader.split(" ");//this will split my parts

  const token= parts[1];//take the token from the header. 

  //i have taken the token from the header, my next job is to see verify the token 

  const decoded= jwt.verify(token, process.env.JWT_SECRET);

  const user= await User.findById(decoded.userId); 
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
  }

module.exports=protect;