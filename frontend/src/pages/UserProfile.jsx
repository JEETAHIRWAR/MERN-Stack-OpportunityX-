import React from "react";
import { useAuth } from "../auth/auth";

function UserProfile() {
  const { user, logout } = useAuth();
  return (
    <div className="text-2xl font-medium capitalize flex flex-col items-center justify-center py-10">
      {user && (
        <h1 className="text-2xl font-medium capitalize">
          👋 Welcome {user.username}
        </h1>
      )}
      <img
        src="/Website-maintenance.png" // Replace with your image path
        alt="User Profile"
        className="w-96 h-96 rounded-full mb-4"
      />
      <p>Profile page is under development</p>
    </div>
  );
}

export default UserProfile;
