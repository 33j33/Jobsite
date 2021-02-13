import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import JobCard from "./JobCard";
import axios from "axios";
import Loader from "react-loader-spinner";
import "./styles/Home.css"



const Home = ({ history }) => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }
    // Filtering Jobs by job title or location
    const filteredJobs = jobs.filter((job) => (
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.location.toLowerCase().includes(searchTerm.toLowerCase()))
    ))
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            const response = await axios.get("https://jobsite-backend.herokuapp.com/job/all");
            setJobs(response.data);
            setIsLoading(false);
        }
        fetchJobs();
    }, [])
    return (
        <>
            <Navbar history={history} />
            <div className="search-box">
                <p>Search Jobs by Job Title or Location</p>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search"
                />
            </div>
            <div className="job-grid">
                {isLoading && <Loader
                    type="Puff"
                    color="#360f5a"
                    height={100}
                    width={100} />
                }
                {
                    !isLoading && filteredJobs && filteredJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))
                }
            </div>

        </>
    )
}

export default Home;