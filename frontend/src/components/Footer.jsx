import React from "react";
import { Link } from "react-router-dom";
//..............................................................................
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} FentiShop. All rights reserved.
        </p>
        <nav className="flex space-x-6 text-sm">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <Link to="/" className="hover:text-white">
            Shop
          </Link>
          <Link to="/about" className="hover:text-white">
            about
          </Link>
          <Link to="/contact" className="hover:text-white">
            contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
