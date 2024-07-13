import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/api/jobs/${id}`
        );
        setJob(response.data);
        // Increment view count
        await axios.put(`http://localhost:8001/api/jobs/${id}/view`);
      } catch (error) {
        console.error("Error fetching job details", error);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      await axios.post("http://localhost:8001/api/applications", {
        jobId: id,
        name,
        email,
      });
      navigate(job.applyLink);
    } catch (error) {
      console.error("Application submission failed", error);
    }
  };

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.description}</p>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default JobDetails;
