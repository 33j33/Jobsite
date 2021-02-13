const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    company_name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    date_posted: {
        type: Date,
        default: Date.now
    },
    recruiter_id: {
        type: String,
        required: true
    },
    candidates_applied: {
        type: [String],
    }
});

module.exports = mongoose.model("Job", jobSchema);