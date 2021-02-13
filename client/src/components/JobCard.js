import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { GoLocation } from "react-icons/go";
import { BiMoney } from "react-icons/bi";
import { BiCalendar } from "react-icons/bi";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import Candidate from "./Candidate";
import axios from "axios";
import "./styles/JobCard.css";
import Loader from "react-loader-spinner";

const JobCard = ({ job, inPostedJobs }) => {
    const { userState } = useContext(UserContext);
    const [isApplied, setIsApplied] = useState(false);
    const [isCollapsed, setCollapse] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsApplied(job.candidates_applied.includes(userState.user.id));
    }, [userState]);
    const handleAccordian = () => {
        setCollapse((prevState) => !prevState);
        const fetchCandidates = async () => {
            axios
                .get(`https://jobsite-backend.herokuapp.com/recruiter/getCandidates/${job._id}`, {
                    headers: {
                        "x-auth-token": localStorage.getItem("authToken"),
                    },
                })
                .then((response) => {
                    setCandidates(response.data);

                })
                .catch((error) => {
                    setCandidates(null);
                });
        };
        if (isCollapsed) {
            fetchCandidates();
        }
    };
    const handleApply = (e) => {
        e.preventDefault();
        const applyJob = async () => {
            setIsLoading(true)
            const response = await axios.patch(
                `https://jobsite-backend.herokuapp.com/candidate/apply/${e.currentTarget.id}`,
                null,
                {
                    headers: {
                        "x-auth-token": localStorage.getItem("authToken"),
                    },
                }
            );
            if (response) {
                setIsLoading(false);
                setIsApplied(true);
            }
        };
        applyJob();
    };
    let date = new Date(job.date_posted);
    date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    return (
        <div className="job-card">
            <div className="header">
                <div className="title">{job.title}</div>
                <div className="subtitle">{job.company_name}</div>
                {userState.isCandidate && (
                    <button
                        className="btn"
                        disabled={isApplied}
                        id={job._id}
                        onClick={handleApply}
                    >
                        {isApplied ? "Applied" : "Apply"}
                    </button>
                )}
                {isLoading && <Loader
                    type="Puff"
                    color="#360f5a"
                    height={20}
                    width={20} />
                }
            </div>
            <div className="body">
                <div className="items">
                    <div className="item">
                        <div className="item-heading">
                            <GoLocation /> LOCATION
            </div>
                        <div className="item-value">{job.location}</div>
                    </div>
                    <div className="item">
                        <div className="item-heading">
                            <BiMoney /> SALARY
            </div>
                        <div className="item-value">{job.salary}</div>
                    </div>
                    <div className="item">
                        <div className="item-heading">
                            <BiCalendar /> POSTED AT
            </div>
                        <div className="item-value">{date}</div>
                    </div>
                </div>
                <hr className="hr" />
                <div className="description">{job.description}</div>
                {inPostedJobs && (
                    <div className="accordian">
                        <div className="header">
                            <button
                                className={!isCollapsed ? "btn-a active" : "btn-a"}
                                onClick={handleAccordian}
                            >
                                {!isCollapsed ? <FaAngleUp /> : <FaAngleDown />}
                            </button>
                            <span>Candidates Applied</span>
                        </div>
                        <div className={!isCollapsed ? "body" : null}>
                            {!isCollapsed &&
                                candidates.map((id) => <Candidate key={id} id={id} />)
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobCard;
