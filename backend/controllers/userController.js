let getMe= ((req,res)=>{

  try{
  return res.status(200).json({
   success:true,
   user: req.user})
  }

  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Server error"
    })
  }
})// this displays the user info. 

let updateProfile = async (req, res) => {
    try {

        const {
            name,
            bio,
            location,
            github,
            portfolio,
            skills
        } = req.body;

        req.user.name = name || req.user.name;
        req.user.bio = bio || req.user.bio;
        req.user.location = location || req.user.location;
        req.user.github = github || req.user.github;
        req.user.portfolio = portfolio || req.user.portfolio;
        req.user.skills = skills || req.user.skills;

        await req.user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: req.user
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports={getMe, updateProfile};