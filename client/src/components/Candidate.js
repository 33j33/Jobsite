import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
const Candidate = ({ id }) => {
  const [candidate, setCandidate] = useState();
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await axios.get(
        `https://jobsite-backend.herokuapp.com/candidate/detail/${id}`
      );
      setCandidate(res.data);
      setIsLoading(false)
    };
    fetchData();
  }, []);
  return (
    <div>
      {isLoading && <Loader
        type="Puff"
        color="#360f5a"
        height={10}
        width={10} />
      }
      {!isLoading && <span><strong>{candidate && candidate.name}</strong>: {candidate && candidate.email}</span>}
    </div>
  );
};

export default Candidate;
