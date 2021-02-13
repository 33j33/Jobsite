import React, { useContext } from "react";
import "./styles/Navbar.css";
import { NavLink } from "react-router-dom";
import UserContext from "../context/UserContext";

const Navbar = ({ history }) => {
  const { userState } = useContext(UserContext);
  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };
  return (
    <div className="navbar">
      <div className="brand">
        <NavLink to={"/home"} className="link">
          Jobsite
        </NavLink>
      </div>
      <div className="items">
        {userState.isCandidate && (
          <button className="btn">
            <NavLink to={"/home/AppliedJobs"} className="link">
              Applied Jobs
            </NavLink>
          </button>
        )}
        {userState.isRecruiter && (
          <button className="btn">
            <NavLink to={"/home/postNewJob"} className="link">
              Post New Job
            </NavLink>
          </button>
        )}
        {userState.isRecruiter && (
          <button className="btn">
            <NavLink to={"/home/PostedJobs"} className="link">
              Posted Jobs
            </NavLink>
          </button>
        )}
        <button className="btn" onClick={logoutHandler}>
          Logout
        </button>
        <div className="name">
          {userState.user.firstName + " " + userState.user.lastName}
          <span>
            {userState.isCandidate ? "(Candidate)" : null}
            {userState.isRecruiter ? "(Recruiter)" : null}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
