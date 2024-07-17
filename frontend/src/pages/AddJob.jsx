import React, { useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "./quillStyles.css";

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
      applicationStartDate: applicationStartDate || "Not mentioned",
      applicationEndDate: applicationEndDate || "Not mentioned",
      category,
      experience,
      jobType,
    };

    try {
      await axios.post("/jobs", jobData);
      alert("Job created successfully!");
      navigate("/admin/dashboard/jobs");
    } catch (error) {
      //console.error("Error creating job:", error);
      setError(error.response?.data?.message || "API request failed");
    }
  };

  return (
    <div className="bg-slate-800 min-h-screen p-5 md:p-10">
      <h2 className="text-2xl font-semibold text-slate-50 bg-slate-900 py-3 px-10 rounded-md shadow-md mb-6">
        Add Job
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-4 md:p-6 rounded-md shadow-md space-y-4 md:space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job Title"
            required
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company Name"
            required
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            required
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={applyLink}
            onChange={(e) => setApplyLink(e.target.value)}
            placeholder="Apply Link"
            required
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={applicationStartDate}
            onChange={(e) => setApplicationStartDate(e.target.value)}
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={applicationEndDate}
            onChange={(e) => setApplicationEndDate(e.target.value)}
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="IT">IT</option>
            <option value="Non-IT">Non-IT</option>
          </select>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="p-3 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Work from Home">Work from Home</option>
            <option value="In Office">In Office</option>
          </select>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Job Description"
            className="quill-editor col-span-1 md:col-span-2 h-40 md:h-fit bg-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Job
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default AddJob;
