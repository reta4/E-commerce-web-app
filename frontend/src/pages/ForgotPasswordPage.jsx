import React, { useState } from "react";
import axios from "../lib/axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!email) return;

    try {
      const res = await axios.post("/auth/forgot-pass", { email });
      console.log(res);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  if (message) {
    return (
      <div className="min-h-screen text-center mt-10">
        <h1>{message}</h1>
      </div>
    );
  } else {
    return (
      <div className="container min-h-screen flex flex-col mt-10 items-center m-auto gap-10 sm:text-sm md:text-2xl lg:text-xl">
        <div>
          <h1>
            please{" "}
            <span className="font-bold text-green-300 underline decoration-gray-600">
              enter your email address
            </span>{" "}
            in order to reset your password
          </h1>
        </div>
        <div>
          <input
            type="email"
            className="text-center shadow-sm text-white shadow-white px-20"
            placeholder="email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="bg-green-500 px-20 rounded-full"
          type="button"
          onClick={handleSend}
        >
          send
        </button>
      </div>
    );
  }
};

export default ForgotPasswordPage;
