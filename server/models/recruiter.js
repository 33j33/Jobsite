const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
    }
});

module.exports = mongoose.model("Recruiter", recruiterSchema);