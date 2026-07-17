//someone requests /me, it will first authenticate and then send the profile. 

const express=require('express')
const {getMe, updateProfile,getUsers,getUserById}= require("../controllers/userController")
const protect= require("../middleware/authMiddleware"); 

const router= express.Router(); 
const { getGithubContributions } = require("../controllers/userController");
router.get("/github/:username/contributions", getGithubContributions); // no auth needed — public data
router.get("/me", protect, getMe);
router.get("/profile", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/:id", getUserById);
router.get("/", getUsers);
module.exports=router;