import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/admin/dashboard/jobs">Manage Jobs</Link>
          </li>
          <li>
            <Link to="/admin/dashboard/add-job">Add New Job</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
