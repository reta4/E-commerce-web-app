import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-550 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-pink-300 mb-4">About Us</h1>
        <p className="text-gray-100 mb-4">
          Welcome to our store! We’re passionate about bringing you the best
          products at fair prices. Our mission is to make shopping simple,
          enjoyable, and trustworthy.
        </p>
        <p className="text-gray-200 mb-6">
          Whether you’re looking for the latest trends or everyday essentials,
          we’re here to serve you with quality and care.
        </p>
        <Link
          to="/"
          className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default About;
