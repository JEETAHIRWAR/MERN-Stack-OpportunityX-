import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import {
  FaSquareInstagram,
  FaLinkedin,
  FaSquareXTwitter,
  FaSquareFacebook,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-white py-8 pt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            {/* Company Info */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pl-10 md:pr-8">
              <Link to="/" className="text-2xl text-slate-300 font-bold ">
                <Logo />
              </Link>
              <p className="mt-4">
                A premier job portal and a proud branch of GhostCode Dynamics,
                committed to bridging the gap between job seekers and
                opportunities.
              </p>
            </div>
            {/* Quick Links */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul>
                <li className="mb-2">
                  <Link to="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/services" className="hover:underline">
                    Services
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            {/* Contact Info */}
            <div className="w-full md:w-1/3">
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p>Email: ghostcodedynamics@gmail.com</p>
              <p>Phone: (+91) 6264516309</p>
              <p>Address: 123 Job St, Bhopal City, Madhya Pradesh</p>
            </div>
          </div>
          {/* Social Media Links */}
          <div className="mt-8 flex justify-center space-x-6">
            <Link
              to="https://www.facebook.com/profile.php?id=61555423443804"
              className="text-white text-2xl hover:text-gray-400"
            >
              <FaSquareFacebook />
            </Link>
            <Link
              to="https://x.com/GhostCodeD07"
              className="text-white text-2xl hover:text-gray-400"
            >
              <FaSquareXTwitter />
            </Link>
            <Link
              to="https://www.linkedin.com/company/ghostcodedynamics/posts/?feedView=all"
              className="text-white text-2xl hover:text-gray-400"
            >
              <FaLinkedin />
            </Link>
            <Link
              to="https://www.instagram.com/ghostcodedynamics?utm_source=qr&igsh=c2J1cjFtNXFxbHJr"
              className="text-white text-2xl hover:text-gray-400"
            >
              <FaSquareInstagram />
            </Link>
          </div>
          {/* Copyright */}
          <div className="mt-8 text-center text-gray-400">
            &copy; {new Date().getFullYear()} OpportunityX. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
