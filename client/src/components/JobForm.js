import React, { useState } from "react";
import "./styles/JobForm.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const JobForm = ({ history }) => {
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobPosted, setJobPosted] = useState(false);
  const [error, setError] = useState("");
  const formHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://jobsite-backend.herokuapp.com/recruiter/postJob",
        {
          title,
          salary,
          location,
          description,
          company_name: companyName,
        },
        { headers: { "x-auth-token": localStorage.getItem("authToken") } }
      )
      .then((res) => {
        setJobPosted(true)
        history.push("/home/PostedJobs");
      })
      .catch((err) => {
        setError(error.response.data.message);
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  };
  return (
    <>
      <Navbar />
      <div className="jobForm">
        <form onSubmit={formHandler} className="jobForm-form">
          <h1 className="title">Job Form</h1>
          <div className="col">
            <div className="row">
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  required
                  id="title"
                  placeholder="Enter Job Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="companyName">Company Name:</label>
                <input
                  type="text"
                  required
                  id="companyName"
                  placeholder="Enter Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  required
                  id="location"
                  placeholder="Enter Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="salary">Salary:</label>
                <input
                  type="text"
                  required
                  id="salary"
                  placeholder="Enter Salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                rows="6"
                required
                id="description"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="btn-row">
              <h6>{jobPosted && "Job Posted"}</h6>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobForm;
