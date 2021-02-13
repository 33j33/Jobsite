import './App.css';
import Home from "./components/Home";
import React, { useState, useEffect } from "react";
import UserContext from "./context/UserContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
import Login from "./components/Login";
import axios from "axios";
import AppliedJobs from './components/AppliedJobs';
import PostedJobs from "./components/PostedJobs";
import LandingPage from "./components/LandingPage";
import JobForm from "./components/JobForm";

function App() {
  const [userState, setUserState] = useState({
    token: null,
    user: {
      id: null,
      email: null,
      firstName: null,
      lastName: null,
    },
    isRecruiter: false,
    isCandidate: false,
    isAuthenticated: false
  });
  const checkLoggedIn = async () => {

    let token = localStorage.getItem("authToken");
    if (token === null) {
      localStorage.setItem("authToken", "");
      token = "";
    }
    // `response` is false if the token is invalid 
    // and it contains the user object if the token is valid
    let response = await axios.post(
      "https://jobsite-backend.herokuapp.com/tokenIsValid",
      null,
      {
        headers: { "x-auth-token": token },
      }
    );
    // Checking if the user is logged in 
    if (response) {
      let loggedInUser;
      if (response.data.hasOwnProperty("candidate")) {
        loggedInUser = { ...response.data.candidate }
      }
      if (response.data.hasOwnProperty("recruiter")) {
        loggedInUser = { ...response.data.recruiter }
      }
      setUserState({
        ...userState,
        token,
        user: loggedInUser,
        isCandidate: response.data.hasOwnProperty("candidate"),
        isRecruiter: response.data.hasOwnProperty("recruiter")
      });
    }
  };
  useEffect(() => {
    checkLoggedIn();
  }, [])
  return (
    <UserContext.Provider value={{ userState, setUserState }}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <PrivateRoute exact path="/home" component={Home} >
            </PrivateRoute>
            <PrivateRoute exact path="/home/postNewJob" component={JobForm} />
            <PrivateRoute exact path="/home/AppliedJobs" component={AppliedJobs} />
            <PrivateRoute exact path="/home/PostedJobs" component={PostedJobs} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
