import React, { useState } from "react";
import axios from "../lib/axios";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState();
  const [confrim, setConfrimPassword] = useState();

  const { id: token } = useParams();

  console.log(token);
  const handleSubmoit = async (e) => {
    e.preventDefault();

    console.log({ password, confrim });

    if (password === confrim) {
      const res = await axios.post("/auth/reset", {
        newPassword: password,
        token: token,
      });

      console.log(res);
    }
  };
  return (
    <form
      onSubmit={handleSubmoit}
      className="container  min-h-screen flex flex-col mt-10 items-center m-auto gap-10"
    >
      <h1 className="text-3xl">
        here, you can reset
        <span className="text-green-400"> your password</span>
      </h1>
      <div className="flex justify-baseline gap-2 border-1 border-black  p-2 text-center items-center">
        <label>enter your password</label>
        <input
          type="password"
          placeholder="*********"
          className="border border-gray-800  p-1 "
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-baseline gap-2 border-1 border-black  p-2 text-center items-center">
        <label>enter your password</label>
        <input
          type="password"
          placeholder="*********"
          className="border border-gray-800  p-1 "
          onChange={(e) => setConfrimPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-green-500 w-[10rem] rounded-full
      hover:animate-bounce
      
      "
      >
        reset
      </button>
    </form>
  );
};

export default ResetPassword;
