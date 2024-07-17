import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../auth/auth";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className=" flex flex-col md:flex-row">
      <div className="md:w-1/5 pl-5 pr-5 bg-slate-800 border-solid shadow-lg shadow-slate-900/40 pt-5">
        <div className="flex items-center md:justify-start justify-between bg-slate-900 px-4 py-3 shadow-lg shadow-slate-900/40 rounded-t-lg">
          <h1 className="text-xl font-medium text-slate-50">Admin Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="text-2xl text-slate-500 p-2 focus:outline-none md:hidden"
          >
            {sidebarOpen ? <IoClose /> : <FaBars />}
          </button>
        </div>

        <div
          className={`h-screen text-white ${
            sidebarOpen ? "block" : "hidden"
          } md:block`}
        >
          <nav>
            <ul>
              {user && (
                <li className="mb-4 bg-slate-900 rounded-b-lg">
                  <span className="block py-2 px-4 rounded-lg capitalize">
                    UserName: {user.username}
                  </span>
                </li>
              )}
              <li className="mb-4 bg-slate-900 rounded-lg">
                <NavLink
                  to="/admin/dashboard/jobs"
                  className={({ isActive }) =>
                    `block py-2 px-10 rounded-lg ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  Manage Jobs
                </NavLink>
              </li>
              <li className="mb-4 bg-slate-900 rounded-lg">
                <NavLink
                  to="/admin/dashboard/add-job"
                  className={({ isActive }) =>
                    `block py-2 px-10 rounded-lg ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  Add New Job
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="bg-slate-800 md:w-4/5">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
