//someone requests /me, it will first authenticate and then send the profile. 

const express=require('express')
const {getMe, updateProfile,getUsers,getUserById, getGithubContributions}= require("../controllers/userController")
const protect= require("../middleware/authMiddleware"); 
const upload = require("../middleware/upload");

const router= express.Router(); 

router.get("/github/:username/contributions", getGithubContributions); // no auth needed — public data
router.get("/me", protect, getMe);
router.get("/profile", protect, getMe);
router.put("/profile", protect, upload.single("avatar"), updateProfile);
router.get("/:id", getUserById);
router.get("/", getUsers);
module.exports=router;