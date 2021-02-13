import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import axios from "axios";
import Loader from "react-loader-spinner";
import "./styles/AppliedJobs.css"
import Navbar from "./Navbar";

const AppliedJobs = ({ history }) => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            axios.get("https://jobsite-backend.herokuapp.com/candidate/appliedJobs",
                {
                    headers: {
                        "x-auth-token": localStorage.getItem("authToken")
                    }
                }
            ).then(response => {
                setJobs(response.data)
                setIsLoading(false);

            }).catch((error) => {
                setJobs(null);
                setIsLoading(false);
            });
        }
        fetchJobs();
    }, [])
    return (
        <>
            <Navbar history={history} />
            <div className="jobs">
                <h3>Applied Jobs</h3>
                <div className="job-grid">
                    {isLoading && <Loader
                        type="Puff"
                        color="#360f5a"
                        height={100}
                        width={100} />
                    }
                    {
                        !isLoading && jobs && jobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))
                    }
                    {
                        !isLoading && !jobs && <h1>No Jobs Found</h1>
                    }
                </div>
            </div>
        </>
    )
}
export default AppliedJobs;
