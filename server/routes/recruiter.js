const express = require('express');
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRecruiter = require("../auth/authRecruiter");
const router = express.Router();

const RecruiterModel = require("../models/recruiter.js");
const JobModel = require("../models/job.js");
const CandidateModel = require("../models/candidate.js")

// Register New Recruiter
router.post("/register", async (req, res) => {
    try {
        let { firstName, lastName, email, password, passwordcheck } = req.body;

        const existingRecruiter = await RecruiterModel.findOne({ email: email });

        //Validation
        if (existingRecruiter) {
            return res.status(400).json("Recruiter already exists!");
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

        //creating new MdeRecruiterModel
        const newRecruiter = new RecruiterModel({
            firstName,
            lastName,
            password: passwordHash,
            email,
        });
        try {
            await newRecruiter.save()
            const token = jwt.sign(
                { id: newRecruiter._id },
                process.env.JWT_SECRET
            );
            res.status(201).json({
                token,
                recruiter: {
                    id: newRecruiter._id,
                    firstName: newRecruiter.firstName,
                    lastName: newRecruiter.lastName,
                    email: newRecruiter.email,
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

// Login Recruiter
// POST request
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        const recruiter = await RecruiterModel.findOne({ email: email });

        //validation
        if (!email || !password) {
            return res.status(400).json({ message: "Enter email/password." });
        }

        if (!recruiter) {
            return res.status(400).json({ message: "The recruiter account doesn't exist!" });
        }
        const isMatch = await bcrypt.compare(password, recruiter.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        // Signing using userid and jwt_secret and generating his token
        const token = jwt.sign(
            { id: recruiter._id },
            process.env.JWT_SECRET
        );
        res.json({
            token,
            recruiter: {
                id: recruiter._id,
                firstName: recruiter.firstName,
                lastName: recruiter.lastName,
                email: recruiter.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// //Validate Recruiter Token from the client's local storage
// router.post("/tokenIsValid", async (req, res) => {
//     try {
//         const token = req.header("x-auth-token");
//         if (!token) {
//             return res.json(false);
//         }
//         const verified = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );
//         if (!verified) {
//             return res.json(false);
//         }
//         const recruiter = await RecruiterModel.findById(verified.id);
//         if (!recruiter) {
//             return res.json(false);
//         }
//         return res.json({
//             token,
//             recruiter: {
//                 id: recruiter._id,
//                 firstName: recruiter.firstName,
//                 lastName: recruiter.lastName,
//                 email: recruiter.email,
//             },
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// Post new job.
// POST request
router.post('/postJob', authRecruiter, async (req, res) => {
    try {
        let { title, location, salary, description, company_name } = req.body;
        // create new job document
        const newJob = new JobModel({
            title, location, salary, description, company_name, recruiter_id: req.user_id
        })
        try {
            await newJob.save();
            res.status(201).json({ message: "New Job Created" });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Get all candidates who have applied to a job posted by recruiter
// GET request
router.get("/getCandidates/:job_id", authRecruiter, async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.job_id);
        if (!job) {
            return res.status(404)
        }
        return res.status(200).json(job.candidates_applied);
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

// Get all jobs posted by the recruiter
// GET request
router.get("/postedJobs", authRecruiter, async (req, res) => {
    try {
        // Find the jobs
        const postedJobsArray = await JobModel.find({ recruiter_id: req.user_id });
        if (postedJobsArray.length === 0) {
            return res.status(404).json({ message: "No Job Found" });
        }
        return res.status(200).json(postedJobsArray);
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router;