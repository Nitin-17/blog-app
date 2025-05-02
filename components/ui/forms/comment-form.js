import React, { useState } from "react";
import Spinner from "../spinner";

const CommentForm = ({ handleSubmit, status }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    website: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onHandleClick = () => {
    handleSubmit(formData);
  };

  return (
    <div className="w-full mx-auto mt-10 p-8 bg-white rounded-2xl border border-gray-200">
      {/* Form Header */}
      <p className="text-sm text-gray-500 mb-4">
        Your email address will not be published. Required fields are marked{" "}
        <span className="text-red-500">*</span>
      </p>

      {/* Comment Form */}
      <form className="space-y-6">
        {/* Comment Field */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.comment}
            onChange={handleChange}
            id="comment"
            rows="4"
            name="comment"
            className="mt-1 block w-full px-4 py-2 border rounded-3xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
            placeholder="Write your comment..."
          ></textarea>
        </div>

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-72 px-4 py-3 border rounded-3xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
            placeholder="Enter your name"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-72 px-4 py-3 border rounded-3xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Website Field */}
        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            className="mt-1 block w-72 px-4 py-3 border rounded-3xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
            placeholder="Enter your website URL"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        {/* Checkbox */}
        {/*   <div className="flex items-start">
          <input
            id="save-info"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="save-info" className="ml-2 text-sm text-gray-500">
            Save my name, email, and website in this browser for the next time I
            comment.
          </label>
        </div> */}

        {/* Submit Button */}
        <button
          onClick={onHandleClick}
          type="button"
          className="w-40 inline-flex justify-center px-6 py-3 rounded-3xl text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-orange-500 shadow-sm hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          {status ? <Spinner /> : <span>Post Comment</span>}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
