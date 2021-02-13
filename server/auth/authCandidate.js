const jwt = require("jsonwebtoken");
require("dotenv").config();

const CandidateModel = require("../models/candidate.js");

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            // 401 - unauthorised
            return res.status(401).json({ message: "No Auth Token" });
        }
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        if (!verified) {
            return res.status(401).json({ message: "Token verification failed" });
        }
        const candidate = await CandidateModel.findById(verified.id);
        if (!candidate) {
            return res.status(401).json({ message: "Candidate Authorisation failed" });
        }
        req.user_id = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;