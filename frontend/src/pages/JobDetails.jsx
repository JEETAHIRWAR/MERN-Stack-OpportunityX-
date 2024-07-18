import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import ReactQuill styles
import "./quillStyles.css"; // Import custom styles for ReactQuill
import { useAuth } from "../auth/auth"; // Import the authentication context
import LoadingDots from "../components/LoadingDots";

import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  XIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hasApplied, setHasApplied] = useState(false); // State to track application status
  const [error, setError] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the authenticated user
  const shareOptionsRef = useRef(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/jobs/${id}`);
        setJob(response.data);
        // Increment view count
        await axios.put(`/jobs/${id}/view`);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching job details", error);
        setError(error.response?.data?.message || "API request failed");
        setLoading(false);
      }
    };

    const checkApplicationStatus = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`/applications/check/${id}`, {
          params: { email: user.email }, // Send user email to check application status
        });
        setHasApplied(response.data.hasApplied); // Set application status
      } catch (error) {
        // console.error("Error checking application status", error);
        setError(error.response?.data?.message || "API request failed");
      }
    };

    fetchJob();
    checkApplicationStatus();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if the input email matches the logged-in user's email
    if (email !== user.email) {
      setError("Please enter correct email.");
      return;
    }

    try {
      await axios.post("/applications", {
        jobId: id,
        name,
        email,
      });
      setHasApplied(true); // Set application status to true
      window.open(job.applyLink, "_blank"); // Open the link in a new tab
    } catch (error) {
      // console.error("Application submission failed", error);
      setError(error.response?.data?.message || "API request failed");
    }
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleClickOutside = (event) => {
    if (
      shareOptionsRef.current &&
      !shareOptionsRef.current.contains(event.target)
    ) {
      setShowShareOptions(false);
    }
  };

  useEffect(() => {
    if (showShareOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareOptions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="bg-gray-50 p-6 rounded-md shadow-md text-slate-900">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{job.title}</h1>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <button
              // onClick={handleSave}
              className="py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Save
            </button>
            <div className="relative" ref={shareOptionsRef}>
              <button
                onClick={toggleShareOptions}
                className="py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Share
              </button>
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10 flex flex-col space-y-2">
                  <EmailShareButton url={window.location.href}>
                    <div className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                      <EmailIcon size={24} round={true} />
                      <span>Email</span>
                    </div>
                  </EmailShareButton>
                  <FacebookShareButton url={window.location.href}>
                    <div className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                      <FacebookIcon size={24} round={true} />
                      <span>Facebook</span>
                    </div>
                  </FacebookShareButton>
                  <LinkedinShareButton url={window.location.href}>
                    <div className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                      <LinkedinIcon size={24} round={true} />
                      <span>LinkedIn</span>
                    </div>
                  </LinkedinShareButton>
                  <TwitterShareButton url={window.location.href}>
                    <div className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                      <XIcon size={24} round={true} />
                      <span>Twitter</span>
                    </div>
                  </TwitterShareButton>
                  <WhatsappShareButton url={window.location.href}>
                    <div className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                      <WhatsappIcon size={24} round={true} />
                      <span>WhatsApp</span>
                    </div>
                  </WhatsappShareButton>
                  <TelegramShareButton url={window.location.href}>
                    <div className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                      <TelegramIcon size={24} round={true} />
                      <span>Telegram</span>
                    </div>
                  </TelegramShareButton>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-lg mb-2">
          <span className="font-semibold">Company:</span> {job.company}{" "}
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold">Location:</span> {job.location}
        </p>
        <div className="mb-6">
          <ReactQuill
            value={job.description || ""}
            readOnly={true}
            theme="bubble"
            className="quill-editor bg-slate-50 text-gray-900 rounded-md"
          />
        </div>
        <div className="bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-2xl text-slate-50 font-semibold mb-4">
            Apply for this job
          </h2>
          {hasApplied ? (
            <p className="text-green-500 text-lg">
              You have already applied for this job.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <p className="error text-rose-500">{error}</p>}
              <button
                onClick={handleApply}
                className="col-span-1 md:col-span-2 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
              >
                Go to Apply page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
