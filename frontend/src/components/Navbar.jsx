import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaUserLarge, FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import Logo from "./Logo";
import { useAuth } from "../auth/auth"; // Import the authentication context

const Navbar = () => {
  const { user, logout } = useAuth(); // Get the authenticated user and logout function
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between md:justify-between lg:justify-between">
      <NavLink
        to="/"
        className="text-2xl text-slate-300 ml-2 md:ml-14 font-bold"
      >
        <Logo />
      </NavLink>
      <div className="flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="text-white md:hidden focus:outline-none"
        >
          {mobileMenuOpen ? (
            <IoClose className="text-3xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}{" "}
          {/* Conditional icon rendering */}
        </button>
        <ul className="hidden md:flex space-x-4 mr-2 md:mr-14 justify-center items-center">
          <li className="text-white">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:bg-slate-700 px-3 py-2 rounded-md ${isActive ? "bg-gray-700" : ""}`
              }
            >
              Home
            </NavLink>
          </li>
          <li className="text-white">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:bg-slate-700 px-3 py-2 rounded-md ${isActive ? "bg-gray-700" : ""}`
              }
            >
              About
            </NavLink>
          </li>
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="hover:bg-teal-800 px-4 py-2  rounded-md bg-gray-700"
            >
              <FaUserLarge className="text-2xl text-slate-300" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
                {user ? (
                  <>
                    <span className="block px-4 py-2 capitalize text-gray-800">
                      Hello👋, {user.username}
                    </span>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-gray-800 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
                      }
                    >
                      Profile
                    </NavLink>
                    {user.role === "admin" && (
                      <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                          `block px-4 py-2 text-gray-800 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
                        }
                      >
                        Admin Dashboard
                      </NavLink>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-gray-800 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
                      }
                    >
                      Register
                    </NavLink>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-gray-800 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
                      }
                    >
                      Login
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
      {mobileMenuOpen && (
        <ul className="md:hidden absolute top-16 left-0 w-full bg-gray-800 z-10">
          <li className="text-white border-t border-gray-700">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
              }
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
          </li>
          <li className="text-white border-t border-gray-700">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
              }
              onClick={closeMobileMenu}
            >
              About
            </NavLink>
          </li>
          {user ? (
            <>
              <li className="text-white border-t border-gray-700">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                  }
                  onClick={closeMobileMenu}
                >
                  Profile
                </NavLink>
              </li>
              {user.role === "admin" && (
                <li className="text-white border-t border-gray-700">
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                    }
                    onClick={closeMobileMenu}
                  >
                    Admin Dashboard
                  </NavLink>
                </li>
              )}
              <li className="text-white border-t border-gray-700">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="text-white border-t border-gray-700">
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                  }
                  onClick={closeMobileMenu}
                >
                  Register
                </NavLink>
              </li>
              <li className="text-white border-t border-gray-700">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                  }
                  onClick={closeMobileMenu}
                >
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
