import React, { useState } from "react";
import LinearSvg from "../linear-svg";
import Spinner from "../spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsLetter = () => {
  const [userEmail, setUserEmail] = useState("");
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState(null);

  const notify = (data) => {
    if (data?.success) {
      return toast.success(data?.message, { position: "bottom-right" });
    }
    return toast.error(data?.message, { position: "bottom-right" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setStatus(true);
      setMessage(null);
      const response = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });
      const data = await response.json();

      if (data?.success) {
        setMessage(data);
        setStatus(false);
        setUserEmail("");
        notify(data);
      } else {
        setMessage(data);
        notify(data);
        setStatus(false);
        //console.error("Failed to subscribe user.");
        setStatus(false);
        setUserEmail("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 md:col-span-1 border-[1px] rounded-lg w-[300px] bg-white border-gray-200  p-6 text-center">
      <h2 className="text-lg font-semibold text-gray-800">Newsletter</h2>

      <LinearSvg />

      <p className="text-gray-600 mb-4">Join 70,000 subscribers!</p>

      <div className="flex flex-col gap-2 mb-2">
        <input
          type="email"
          placeholder="Email address"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full px-4 py-2 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-pink-200"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full flex justify-center items-center py-2 px-4 text-white rounded-full bg-gradient-to-r from-pink-500 to-orange-400 shadow-md hover:from-pink-600 hover:to-orange-500 focus:ring-4 focus:ring-pink-300"
        >
          {status ? <Spinner /> : <span>Sign Up</span>}
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        By signing up, you agree to our{" "}
        <a href="#" className="text-pink-500 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default NewsLetter;
