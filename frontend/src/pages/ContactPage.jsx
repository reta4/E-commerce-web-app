import React, { useState } from "react";
import { Link } from "react-router-dom";

const ContactPage = () => {
  const [send, setSend] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSend(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-350 px-6">
      {!send && (
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white-600 mb-6">
            Have a question? Send us a quick message.
          </p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              rows="3"
              placeholder="Message"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {send && (
        <div className="max-w-lg w-full text-center">
          <h1>
            your message has been send , we will connect you soon as possible
          </h1>
          <Link to="/">
            <button className="w-50 bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-700 transition m-5">
              go back to shope
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
