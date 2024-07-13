// Home.jsx

import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { Link } from "react-router-dom";
import { FaSearch, FaSearchLocation } from "react-icons/fa";

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
  const [error, setErrorState] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/jobs");
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch jobs");
        setErrorState(error.response?.data?.message || "Failed to fetch jobs");
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

  // useEffect(() => {
  //   // Simulating a network request
  //   setTimeout(() => {
  //     setLoading(false);
  //     setError("Network Connection Error");
  //   }, 3000);
  // }, []);

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
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#c99a8b]">
        <img
          src="../public/404-Notfound.png"
          alt="404 Not Found"
          className="w-2/2 mb-4 z-10 relative"
        />
        <p className="text-4xl font-bold text-slate-600 z-20 relative">
          Network Connection Error {error}
        </p>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 ml-14">Job Listings</h1>
      <div className="mb-6">
        <div className="flex mb-2 justify-center">
          <div className="relative w-2/3 mr-2">
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Company Name, City, Job Role"
              value={searchQuery}
              onChange={handleSearch}
              className="p-2 pl-10 border rounded-tl-3xl rounded-bl-3xl rounded-br-3xl w-full"
            />
          </div>
          <div className="relative w-96 ml-2">
            <FaSearchLocation className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="p-2 pl-10 border rounded-tl-3xl rounded-br-3xl rounded-tr-3xl w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 mx-12 ">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mb-2 p-2 border rounded-tl-3xl rounded-bl-3xl rounded-br-3xl text-gray-500"
          >
            <option value="">All Categories</option>
            <option value="IT">IT</option>
            <option value="Non-IT">Non-IT</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="mb-2 p-2 border rounded-bl-3xl rounded-tr-3xl text-gray-500"
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
            className="mb-2 p-2 border rounded-tl-3xl rounded-br-3xl text-gray-500"
          >
            <option value="">All Experience Levels</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="mb-2 p-2 border rounded-bl-3xl rounded-tr-3xl text-gray-500"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-12">
          {/* <ul> */}
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white shadow-md rounded-lg p-6">
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
              <Link to={`/job/${job._id}`} className="no-underline">
                View Details
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

// import React, { useEffect, useState } from "react";
// import axios from "../utils/api";
// import { Link } from "react-router-dom";

// const Home = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [locationFilter, setLocationFilter] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [dateFilter, setDateFilter] = useState("");
//   const [experienceFilter, setExperienceFilter] = useState("");
//   const [jobTypeFilter, setJobTypeFilter] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState(null);
//   const [currentFilter, setCurrentFilter] = useState("");

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await axios.get("/jobs");
//         setJobs(response.data);
//         setFilteredJobs(response.data); // Set filteredJobs to the full list initially
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//         setError(error.response?.data?.message || "Failed to fetch jobs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   useEffect(() => {
//     handleFilter();
//   }, [
//     locationFilter,
//     categoryFilter,
//     dateFilter,
//     experienceFilter,
//     jobTypeFilter,
//     searchQuery,
//   ]);

//   const handleFilter = () => {
//     let filtered = [...jobs];

//     if (locationFilter) {
//       filtered = filtered.filter((job) =>
//         job.location?.toLowerCase().includes(locationFilter.toLowerCase())
//       );
//     }

//     if (categoryFilter) {
//       filtered = filtered.filter((job) => job.category === categoryFilter);
//     }

//     if (dateFilter) {
//       const now = new Date();
//       let dateLimit;

//       switch (dateFilter) {
//         case "24hours":
//           dateLimit = new Date(now.setDate(now.getDate() - 1));
//           break;
//         case "2days":
//           dateLimit = new Date(now.setDate(now.getDate() - 2));
//           break;
//         case "4days":
//           dateLimit = new Date(now.setDate(now.getDate() - 4));
//           break;
//         case "7days":
//           dateLimit = new Date(now.setDate(now.getDate() - 7));
//           break;
//         default:
//           dateLimit = null;
//       }

//       filtered = filtered.filter((job) => new Date(job.createdAt) >= dateLimit);
//     }

//     if (experienceFilter) {
//       filtered = filtered.filter((job) => job.experience === experienceFilter);
//     }

//     if (jobTypeFilter) {
//       filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (job) =>
//           job.title?.toLowerCase().includes(query) ||
//           job.company?.toLowerCase().includes(query) ||
//           job.location?.toLowerCase().includes(query) ||
//           job.jobType?.toLowerCase().includes(query)
//       );
//     }

//     setFilteredJobs(filtered);
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleFilterSelect = (e) => {
//     setCurrentFilter(e.target.value);
//   };

//   const renderFilterInput = () => {
//     switch (currentFilter) {
//       case "location":
//         return (
//           <input
//             type="text"
//             placeholder="Filter by location"
//             value={locationFilter}
//             onChange={(e) => setLocationFilter(e.target.value)}
//             className="mb-2 p-2 border rounded"
//           />
//         );
//       case "category":
//         return (
//           <select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//             className="mb-2 p-2 border rounded"
//           >
//             <option value="">All Categories</option>
//             <option value="IT">IT</option>
//             <option value="Non-IT">Non-IT</option>
//           </select>
//         );
//       case "date":
//         return (
//           <select
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//             className="mb-2 p-2 border rounded"
//           >
//             <option value="">Anytime</option>
//             <option value="24hours">Last 24 hours</option>
//             <option value="2days">Last 2 days</option>
//             <option value="4days">Last 4 days</option>
//             <option value="7days">Last 7 days</option>
//           </select>
//         );
//       case "experience":
//         return (
//           <select
//             value={experienceFilter}
//             onChange={(e) => setExperienceFilter(e.target.value)}
//             className="mb-2 p-2 border rounded"
//           >
//             <option value="">All Experience Levels</option>
//             <option value="Fresher">Fresher</option>
//             <option value="Experienced">Experienced</option>
//           </select>
//         );
//       case "jobType":
//         return (
//           <select
//             value={jobTypeFilter}
//             onChange={(e) => setJobTypeFilter(e.target.value)}
//             className="mb-2 p-2 border rounded"
//           >
//             <option value="">All Job Types</option>
//             <option value="Work from Home">Work from Home</option>
//             <option value="In Office">In Office</option>
//           </select>
//         );
//       default:
//         return null;
//     }
//   };

//   if (loading) return <p>Loading jobs...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6 ml-5">Job Listings</h1>
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by title, company, location, job type"
//           value={searchQuery}
//           onChange={handleSearch}
//           className="mb-2 p-2 border rounded w-full"
//         />
//         <div className="flex flex-wrap gap-2">
//           <select
//             value={currentFilter}
//             onChange={handleFilterSelect}
//             className="mb-2 p-2 border rounded"
//           >
//             <option value="">Select Filter</option>
//             <option value="location">Filter by Location</option>
//             <option value="category">Filter by Category</option>
//             <option value="date">Filter by Date Posted</option>
//             <option value="experience">Filter by Experience Level</option>
//             <option value="jobType">Filter by Job Type</option>
//           </select>
//           {renderFilterInput()}
//         </div>
//         <button
//           onClick={handleFilter}
//           className="p-2 bg-blue-500 text-white rounded"
//         >
//           Apply Filters
//         </button>
//       </div>
//       {filteredJobs.length === 0 ? (
//         <p>No jobs available at the moment.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredJobs.map((job) => (
//             <div key={job._id} className="bg-white shadow-md rounded-lg p-6">
//               <h2 className="text-2xl font-semibold mb-2">
//                 <Link to={`/job/${job._id}`} className="no-underline">
//                   {job.title}
//                 </Link>
//               </h2>
//               <p className="text-gray-700 mb-2">Company: {job.company}</p>
//               <p className="text-gray-700 mb-2">Location: {job.location}</p>
//               <p className="text-gray-700 mb-2">
//                 Start Date:{" "}
//                 {new Date(job.applicationStartDate).toLocaleDateString()}
//               </p>
//               <p className="text-gray-700 mb-2">
//                 End Date:{" "}
//                 {new Date(job.applicationEndDate).toLocaleDateString()}
//               </p>
//               <Link to={`/job/${job._id}`} className="no-underline">
//                 View Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
