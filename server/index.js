const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const CandidateModel = require("./models/candidate.js");
const RecruiterModel = require("./models/recruiter.js");
const jwt = require("jsonwebtoken");



const app = express();

app.use(cors());

// Needed to parse contents inside POST / PUT body when sent as JSON object
// parse application/json
app.use(express.json());

// Needed to parse contents inside POST / PUT body when sent as string or array
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));



// Connect to Mongoose
const mongodbURI = process.env.DB_URI;
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(process.env.PORT || 8000, () => {
            console.log("Connection to DB established and Server is running");
        })
    })
    .catch((err) => {
        console.log(err)
    })

// We don't want server to listen for requests before the connection to the database has been established
// Hence we enclose the app.listen inside the then() so that it runs only when the 
// connection is successfully established
// mongoose.connect returns a promise.


app.get('/', (req, res) => {
    return res.status(200).send("I am Alive");
})

// ROUTES
const candidateRouter = require("./routes/candidate");
app.use('/candidate', candidateRouter);

const recruiterRouter = require("./routes/recruiter");
app.use('/recruiter', recruiterRouter);

const jobRouter = require("./routes/job");
app.use('/job', jobRouter);

// Validate Token from the client's local storage
app.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.json(false);
        }
        // This function takes token and JWT_SECRET and gives user id as the output
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        if (!verified) {
            return res.json(false);
        }
        const recruiter = await RecruiterModel.findById(verified.id);
        if (!recruiter) {
            const candidate = await CandidateModel.findById(verified.id);
            if (!candidate) {
                return res.json(false);
            }
            else {
                return res.status(200).json({
                    token,
                    candidate: {
                        id: candidate._id,
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                        email: candidate.email,
                    },
                });
            }
        }
        return res.status(200).json({
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
