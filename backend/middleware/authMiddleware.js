const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;


    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            console.log("TOKEN:", token);

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            console.log("DECODED:", decoded);

            req.user = {
                _id: decoded.userId,
            };

            next();
        } catch (err) {
            console.log("JWT ERROR:", err.message);

            return res.status(401).json({
                message: "Unauthorized",
            });
        }
    } else {
        return res.status(401).json({
            message: "No token",
        });
    }
};

module.exports = protect;