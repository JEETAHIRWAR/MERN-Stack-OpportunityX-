// Home.jsx

import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { Link } from "react-router-dom";
import { FaSearch, FaSearchLocation } from "react-icons/fa";
import { useAuth } from "../auth/auth";

const Home = ({ setError }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/jobs");
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Network Connection Error");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [setError]);

  useEffect(() => {
    // handleFilter();
  }, [
    locationFilter,
    categoryFilter,
    dateFilter,
    experienceFilter,
    jobTypeFilter,
  ]);

  useEffect(() => {
    handleFilter();
  }, [searchQuery]);

  const handleFilter = () => {
    let filtered = [...jobs];

    if (locationFilter) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((job) => job.category === categoryFilter);
    }

    if (dateFilter) {
      const now = new Date();
      let dateLimit;

      switch (dateFilter) {
        case "24hours":
          dateLimit = new Date(now.setDate(now.getDate() - 1));
          break;
        case "2days":
          dateLimit = new Date(now.setDate(now.getDate() - 2));
          break;
        case "4days":
          dateLimit = new Date(now.setDate(now.getDate() - 4));
          break;
        case "7days":
          dateLimit = new Date(now.setDate(now.getDate() - 7));
          break;
        default:
          dateLimit = null;
      }

      filtered = filtered.filter((job) => new Date(job.createdAt) >= dateLimit);
    }

    if (experienceFilter) {
      filtered = filtered.filter((job) => job.experience === experienceFilter);
    }

    if (jobTypeFilter) {
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query) ||
          job.jobType?.toLowerCase().includes(query)
      );
    }
    setFilteredJobs(filtered);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = () => {
    handleFilter();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingDots />
      </div>
    );

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 md:ml-14 ml-4">
        {user && (
          <span className="block py-2 rounded-lg capitalize">
            👋 Welcome : {user.username}
          </span>
        )}
        Job Listings{" "}
      </h1>
      <div className="mb-6">
        <div className="flex mb-2 justify-center">
          <div className="relative w-full md:w-2/3 mr-2">
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Company Name, City, Job Role"
              value={searchQuery}
              onChange={handleSearch}
              className="p-2 pl-10 border-slate-300 border rounded-tl-3xl rounded-bl-3xl rounded-br-3xl w-full"
            />
          </div>
          <div className="relative w-full md:w-96 ml-2 hidden md:block">
            <FaSearchLocation className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="p-2 pl-10 border-slate-300 border rounded-tl-3xl rounded-br-3xl rounded-tr-3xl w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 md:mx-12 ">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mb-2 p-2 border-slate-300 border rounded-tl-3xl rounded-bl-3xl rounded-br-3xl text-gray-500"
          >
            <option value="">All Categories</option>
            <option value="IT">IT</option>
            <option value="Non-IT">Non-IT</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="mb-2 p-2 border-slate-300 border rounded-bl-3xl rounded-tr-3xl text-gray-500"
          >
            <option value="">Anytime</option>
            <option value="24hours">Last 24 hours</option>
            <option value="2days">Last 2 days</option>
            <option value="4days">Last 4 days</option>
            <option value="7days">Last 7 days</option>
          </select>
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="mb-2 p-2 border-slate-300 border rounded-tl-3xl rounded-br-3xl text-gray-500"
          >
            <option value="">All Experience Levels</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="mb-2 p-2 border-slate-300 border rounded-bl-3xl rounded-tr-3xl text-gray-500"
          >
            <option value="">All Job Types</option>
            <option value="Work from Home">Work from Home</option>
            <option value="In Office">In Office</option>
          </select>
          <button
            onClick={handleFilterClick}
            className="px-4 h-10 bg-slate-600 hover:bg-slate-700 text-white rounded-tl-3xl rounded-br-3xl rounded-tr-3xl"
          >
            Apply Filters
          </button>
        </div>
      </div>
      {filteredJobs.length === 0 ? (
        <p className="mb-2 justify-center text-center origin-center text-2xl">
          No jobs available at the moment. 🙄
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mx-12">
          {/* <ul> */}
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white shadow-md rounded-lg p-6">
              <Link to={`/job/${job._id}`} className="no-underline">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    <Link to={`/job/${job._id}`} className="no-underline">
                      {job.title}
                    </Link>
                  </h2>
                  <p className="text-gray-700 mb-2">Company: {job.company}</p>
                  <p className="text-gray-700 mb-2">Location: {job.location}</p>
                  <p className="text-gray-700 mb-2">
                    Start Date:{" "}
                    {new Date(job.applicationStartDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-2">
                    End Date:{" "}
                    {new Date(job.applicationEndDate).toLocaleDateString()}
                  </p>
                  <div className="flex justify-start mt-4">
                    <Link
                      to={`/job/${job._id}`}
                      className="inline-block px-4 py-1 text-white bg-gradient-to-r from-slate-500 to-indigo-600 rounded-full text-lg font-semibold shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {/* </ul> */}
        </div>
      )}
    </div>
  );
};

export default Home;
