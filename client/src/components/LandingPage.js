import React, { useEffect } from "react";
import "./styles/LandingPage.css";
import { SiWheniwork } from "react-icons/si"
import { Link } from "react-router-dom";

const LandingPage = ({ history }) => {
    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/home")
        }
    }, [history])

    return (
        <div className="landingPage">
            <div className="overlay">
                <div className="header">
                    <SiWheniwork className="logo" />
                    <h1>JOBSITE</h1>
                    <p>Search latest job openings online including IT, Sales, Banking, Fresher, Walk-ins, Part time, Govt jobs on jobsite.com</p>
                </div>
                <button><Link to="/login" className="link">LOGIN</Link></button>
                <button><Link to="/register" className="link">REGISTER</Link></button>
            </div>

        </div>
    )
}
export default LandingPage