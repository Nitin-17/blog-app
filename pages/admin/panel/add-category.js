import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";
import Modal from "../../../components/ui/modal";
import Spinner from "../../../components/ui/spinner";
import ErrorModal from "../../../components/ui/modal/error-modal";
import SuccessModal from "../../../components/ui/modal/success-modal";

const AddCategory = () => {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setStatus(true);
      const response = await fetch("/api/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });
      const data = await response.json();
      if (data?.success) {
        setMessage(data);
        setCategory("");
        setStatus(false);
      } else {
        setMessage(data);
        setStatus(false);
        console.error("Failed to save category.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mb-[28rem]">
      <nav className="flex flex-row justify-between p-8">
        <Link href="/admin" className="hover:text-pink-500">
          <FontAwesomeIcon icon={faArrowLeft} /> Go Back
        </Link>
        <span className="text-black-500 font-bold text-xl">Add Category</span>
        <span></span>
      </nav>

      <div className="max-w-md mx-auto mt-10" onSubmit={handleSubmit}>
        <label
          for="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-pink-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-white border border-gray-300 rounded-lg bg-gradient-to-r from-[#ffa387] to-[#ef3d5d] focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Add a Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="text-white absolute w-16 end-2.5 bottom-2.5 bg-[#ffa387] hover:bg-[#f59274] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
          >
            {status ? <Spinner /> : <span>Add</span>}
          </button>
        </div>
        <div className="relative">
          {message?.success == false ? (
            <ErrorModal message={message} setMessage={setMessage} />
          ) : (
            <SuccessModal message={message} setMessage={setMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
