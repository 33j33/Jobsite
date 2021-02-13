import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/Login.css";
import UserContext from "../context/UserContext";


const Login = ({ history }) => {
    const [isRecruiter, setIsRecruiter] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { userState, setUserState } = useContext(UserContext);

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/home")
        }
    }, [history]);
    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${isRecruiter ? "https://jobsite-backend.herokuapp.com/recruiter/login" : "https://jobsite-backend.herokuapp.com/candidate/login"}`,
                {
                    email,
                    password,
                },
            );
            {
                isRecruiter
                    ? setUserState({ ...userState, token: data.token, user: { ...data.recruiter }, isRecruiter: true, isCandidate: false, isAuthenticated: true }) :
                    setUserState({ ...userState, token: data.token, user: { ...data.candidate }, isCandidate: true, isRecruiter: false, isAuthenticated: true })
            }
            localStorage.setItem("authToken", data.token);
            // Redirecting to home after login
            history.push("/home");
        } catch (error) {
            setError(error.response.data.message);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <div className="login">
            <form onSubmit={loginHandler} className="login-form">
                <h3 className="title">Login</h3>
                {error && <span className="error-message">{error}</span>}
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
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
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
                    Login
                </button>
                <span className="login-subtext">
                    Don't have an account? <Link to="/register">Register</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;