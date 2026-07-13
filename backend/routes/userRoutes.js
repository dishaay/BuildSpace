//someone requests /me, it will first authenticate and then send the profile. 

const express=require('express')
const {getMe, updateProfile}= require("../controllers/userController")
const protect= require("../middleware/authMiddleware"); 
const router= express.Router(); 
router.get("/me",protect,getMe);
router.put("/profile", protect, updateProfile);
router.get("/profile", protect, getMe);
module.exports=router;