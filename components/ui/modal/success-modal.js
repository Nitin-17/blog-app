import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const SuccessModal = ({ message, setMessage }) => {
  if (!message) return null;
  useEffect(() => {
    const scrollableElement = document.documentElement;
    scrollableElement.style.overflow = "hidden";

    return () => {
      scrollableElement.style.overflow = "auto";
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => setMessage("")}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          {/* Modal Content */}
          <div className="p-4 md:p-5 text-center">
            <svg
              className="mx-auto mb-4 text-green-400 w-12 h-12"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-primary-600">
              {message?.message}
            </h3>
            <button
              onClick={() => setMessage("")}
              type="button"
              className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SuccessModal;
