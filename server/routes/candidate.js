const express = require('express');
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authCandidate = require("../auth/authCandidate");
const router = express.Router();

const CandidateModel = require("../models/candidate.js");
const JobModel = require("../models/job.js");

// Register New Candidate
// POST
router.post("/register", async (req, res) => {
    try {
        let { firstName, lastName, email, password, passwordcheck } = req.body;

        const existingCandidate = await CandidateModel.findOne({ email: email });

        //Validation
        if (existingCandidate) {
            return res.status(400).json("Candidate already exists!");
        }
        if (!firstName || !lastName || !email || !password || !passwordcheck) {
            return res.status(400).json("Fill all the fields");
        }
        if (password.length < 8 || password.length > 100) {
            return res.status(400).json("Password length must be 8-100 characters long");
        }
        // If both passwords entered match or not
        if (password !== passwordcheck) {
            return res.status(400).json("Passwords do not match");
        }
        //Password hashing using bcryptjs
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        //creating new Candidate
        const newCandidate = new CandidateModel({
            firstName,
            lastName,
            password: passwordHash,
            email,
        });
        try {
            await newCandidate.save()
            // Signing using userid and jwt_secret and generating the token
            const token = jwt.sign(
                { id: newCandidate._id },
                process.env.JWT_SECRET
            );
            res.status(201).json({
                token,
                candidate: {
                    id: newCandidate._id,
                    firstName: newCandidate.firstName,
                    lastName: newCandidate.lastName,
                    email: newCandidate.email,
                },
            });
        } catch (err) {
            // 400 means something was wrong with user input and 
            // hence the request couldn't be completed
            res.status(400).json({ err: err.message });
        }
    } catch (err) {
        // Internal server error
        res.status(500).json({ error: err.message });
    }
});

// Login Candidate
// POST request
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        const candidate = await CandidateModel.findOne({ email: email });

        //validation
        if (!email || !password) {
            return res.status(400).json({ message: "Enter email/password." });
        }
        if (!candidate) {
            return res.status(400).json({ message: "The candidate account doesn't exist!" });
        }
        const isMatch = await bcrypt.compare(password, candidate.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        // Signing using userid and jwt_secret and generating the token
        const token = jwt.sign(
            { id: candidate._id },
            process.env.JWT_SECRET
        );
        res.json({
            token,
            candidate: {
                id: candidate._id,
                firstName: candidate.firstName,
                lastName: candidate.lastName,
                email: candidate.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Add candidate's name to `candidate_applied` array of JobModel
// PATCH
router.patch('/apply/:job_id', authCandidate, async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.job_id);
        if (!job) {
            return res.status(400).json({ message: "Error" })
        }
        const candidate_id = req.user_id
        // If the candidate hasn't already applied, then only push his id to the array
        if (!job.candidates_applied.includes(candidate_id)) {
            job.candidates_applied.push(candidate_id)
            await job.save();
            return res.status(200).json({ message: "Applied to the Job" })
        }
        else {
            return res.status(400).json({ message: "Already Applied to the job" })
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
})



// Get all jobs that candidates has applied
// GET request
router.get("/appliedJobs", authCandidate, async (req, res) => {
    try {
        // Find the jobs which contain candidate id in `candidates_applied` Array 
        const appliedJobsArray = await JobModel.find({ candidates_applied: req.user_id });
        if (appliedJobsArray.length === 0) {
            return res.status(404).json({ message: "Applied to No Job" });
        }
        return res.status(200).json(appliedJobsArray);
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//Get email of candidates by candidateId
//GET request
router.get("/detail/:id", async (req, res) => {
    try {
        const candidate = await CandidateModel.findById(req.params.id);
        if (!candidate) {
            res.status(400).json({ message: "No candidate found" });
        }
        res.status(200).json({ email: candidate.email, name: candidate.firstName + " " + candidate.lastName });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;