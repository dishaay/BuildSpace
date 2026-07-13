    let getMe= ((req,res)=>{

    try{
        console.log("===== GET PROFILE CALLED =====");
  console.log(req.user);
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
    username,
    name,
    bio,
    location,
    github,
    portfolio,
    linkedin,
    college,
    year,
    lookingForTeam,
    skills
} = req.body;

        if (username !== undefined) req.user.username = username;
if (name !== undefined) req.user.name = name;
if (bio !== undefined) req.user.bio = bio;
if (location !== undefined) req.user.location = location;
if (github !== undefined) req.user.github = github;
if (portfolio !== undefined) req.user.portfolio = portfolio;
if (linkedin !== undefined) req.user.linkedin = linkedin;
if (college !== undefined) req.user.college = college;
if (year !== undefined) req.user.year = year;
if (lookingForTeam !== undefined)
    req.user.lookingForTeam = lookingForTeam;
if (skills !== undefined) req.user.skills = skills;

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