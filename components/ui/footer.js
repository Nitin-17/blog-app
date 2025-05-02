import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <>
      <footer className=" border-t border-gray-200 mt-8 py-4">
        <div className="container mx-auto w-auto flex justify-between items-center px-4 md:px-8">
          <div className="text-sm text-gray-500">
            © 2023 Apollo. Theme by{" "}
            <a href="#" className="hover:underline text-gray-600">
              AWS
            </a>
            .
          </div>

          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-[#fe4f70]">
              <FontAwesomeIcon icon={faFacebook} size="md" />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#fe4f70]">
              <FontAwesomeIcon icon={faInstagram} size="md" />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#fe4f70]">
              <FontAwesomeIcon icon={faPinterest} size="md" />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#fe4f70]">
              <FontAwesomeIcon icon={faYoutube} size="md" />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#fe4f70]">
              <FontAwesomeIcon icon={faTwitter} size="md" />
            </a>
          </div>

          <div>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-full px-3 py-1">
              <span className="mr-1">↑</span> Back to Top
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
