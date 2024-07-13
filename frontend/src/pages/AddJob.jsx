// AddJob.jsx

import React, { useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [applicationStartDate, setApplicationStartDate] = useState("");
  const [applicationEndDate, setApplicationEndDate] = useState("");
  const [category, setCategory] = useState("IT");
  const [experience, setExperience] = useState("Fresher");
  const [jobType, setJobType] = useState("Work from Home");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      title,
      description,
      company,
      location,
      applyLink,
      applicationStartDate,
      applicationEndDate,
      category,
      experience,
      jobType,
    };

    try {
      await axios.post("/jobs", jobData);
      alert("Job created successfully!");
      navigate("/admin/dashboard/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      setError(error.response?.data?.message || "API request failed");
    }
  };

  return (
    <div>
      <h2>Add Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job Title"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Job Description"
          required
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <input
          type="text"
          value={applyLink}
          onChange={(e) => setApplyLink(e.target.value)}
          placeholder="Apply Link"
          required
        />
        <input
          type="date"
          value={applicationStartDate}
          onChange={(e) => setApplicationStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={applicationEndDate}
          onChange={(e) => setApplicationEndDate(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="IT">IT</option>
          <option value="Non-IT">Non-IT</option>
        </select>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="Fresher">Fresher</option>
          <option value="Experienced">Experienced</option>
        </select>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="Work from Home">Work from Home</option>
          <option value="In Office">In Office</option>
        </select>
        <button type="submit">Add Job</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddJob;
