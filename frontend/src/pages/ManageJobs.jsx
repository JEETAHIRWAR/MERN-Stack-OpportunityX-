// src/pages/ManageJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/api";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div>
      <h2>Manage Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            {job.title}
            <button onClick={() => handleDelete(job._id)}>Delete</button>
            <button onClick={() => alert("Edit functionality not implemented")}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageJobs;
