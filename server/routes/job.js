const express = require('express');

const router = express.Router();

const JobModel = require("../models/job.js");

// Get all jobs from `jobs` collection
// GET request
router.get('/all', async (req, res) => {
    try {
        const jobs = await JobModel.find();
        res.status(200).json(jobs);
    }
    catch (err) {
        // internal server error
        res.status(500).json({ "error": err.message })
    }
})

module.exports = router;