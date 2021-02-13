import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/Register.css";
import UserContext from "../context/UserContext";


const Register = ({ history }) => {
    const [isRecruiter, setIsRecruiter] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordcheck, setPasswordcheck] = useState("");
    const [error, setError] = useState("");
    const { userState, setUserState } = useContext(UserContext);
    console.log(isRecruiter);
    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/home")
        }
    }, [history]);
    const registerHandler = async (e) => {
        e.preventDefault();

        if (password !== passwordcheck) {
            setPassword("");
            setPasswordcheck("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Passwords do not match");
        }

        try {
            const { data } = await axios.post(
                `${isRecruiter ? "https://jobsite-backend.herokuapp.com/recruiter/register" : "https://jobsite-backend.herokuapp.com/candidate/register"}`,
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    passwordcheck
                },
            );
            {
                isRecruiter
                    ? setUserState({ ...userState, token: data.token, user: { ...data.recruiter }, isRecruiter: true, isCandidate: false, isAuthenticated: true }) :
                    setUserState({ ...userState, token: data.token, user: { ...data.candidate }, isCandidate: true, isRecruiter: false, isAuthenticated: true })
            }
            localStorage.setItem("authToken", data.token);
            // Redirecting to home after register
            history.push("/home");
        } catch (error) {
            setError(error.response.data.message);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <div className="register">
            <form onSubmit={registerHandler} className="register-form">
                <h3 className="title">Register</h3>
                {error && <span className="error-message">{error}</span>}
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        required
                        id="firstName"
                        placeholder="Enter First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        required
                        id="lastName"
                        placeholder="Enter Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        required
                        id="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        required
                        id="password"
                        autoComplete="true"
                        placeholder="Enter password"
                        value={password}
                        minLength={8}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordcheck">Confirm Password:</label>
                    <input
                        type="password"
                        required
                        id="passwordcheck"
                        autoComplete="true"
                        placeholder="Confirm password"
                        value={passwordcheck}
                        minLength={8}
                        onChange={(e) => setPasswordcheck(e.target.value)}
                    />
                </div>
                {/* Same state is for both the radio buttons to make them work in tandem */}
                <div className="form-group radio">
                    <label htmlFor="recruiter">Recruiter:</label>
                    <input
                        type="radio"
                        value="recruiter"
                        name="type"
                        id="recruiter"
                        checked={isRecruiter}
                        onChange={(e) => setIsRecruiter((prevState) => !prevState)}
                    />
                    <label htmlFor="candidate">Candidate:</label>
                    <input
                        type="radio"
                        value="candidate"
                        name="type"
                        id="candidate"
                        checked={!isRecruiter}
                        onChange={(e) => setIsRecruiter((prevState) => !prevState)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Register
                </button>
                <span className="register-subtext">
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Register;