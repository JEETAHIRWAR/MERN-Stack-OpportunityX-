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
        // console.error("Error fetching jobs:", error);
        setError(error.response?.data?.message || "API request failed");
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      // console.error("Error deleting job:", error);
      setError(error.response?.data?.message || "API request failed");
    }
  };

  return (
    <div className="bg-slate-800 min-h-screen p-10">
      <h2 className="text-2xl font-semibold text-slate-50 bg-slate-900 py-3 px-10 rounded-md shadow-md mb-6">
        Manage Jobs
      </h2>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job._id}
            className="bg-slate-700 p-6 rounded-md shadow-md flex flex-col md:flex-row justify-between items-center"
          >
            <span className="text-lg text-slate-200 mb-4 md:mb-0">
              {job.title}
            </span>
            <div className="space-x-0 space-y-4 md:space-x-3 md:space-y-0 flex flex-col md:flex-row w-full md:w-auto">
              <button
                onClick={() => handleDelete(job._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-full md:w-auto"
              >
                Delete
              </button>
              <button
                onClick={() => alert("Edit functionality not implemented")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full md:w-auto"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageJobs;
