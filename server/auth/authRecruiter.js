const jwt = require("jsonwebtoken");
require("dotenv").config();

const RecruiterModel = require("../models/recruiter.js");

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            // 401 - Unauthorised
            return res.status(401).json({ message: "No Auth Token" });
        }
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        if (!verified) {
            return res.status(401).json({ message: "Token verification failed" });
        }
        const recruiter = await RecruiterModel.findById(verified.id);
        if (!recruiter) {
            return res.status(401).json({ message: "Recruiter authorisation failed" });
        }
        req.user_id = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;