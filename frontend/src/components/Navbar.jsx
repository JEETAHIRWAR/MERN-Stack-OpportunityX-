import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import Logo from "./Logo";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl text-slate-300 ml-14 font-bold ">
        <Logo />
      </Link>
      <ul className="flex space-x-4 mr-14">
        <li className="text-white">
          <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md">
            Home
          </Link>
        </li>
        <li className="text-white">
          <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md">
            About
          </Link>
        </li>
        <li className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="text-white hover:bg-gray-700 px-6 py-2 rounded-md"
          >
            <FaUserLarge />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
              <Link
                to="/register"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Login
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
