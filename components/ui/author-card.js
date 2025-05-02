import React from "react";
import Image from "next/image";
import {
  faFacebook,
  faTwitter,
  faSnapchat,
  faYoutube,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AuthorCard = () => {
  return (
    <div className="w-full mx-auto mt-10 bg-blue-50 p-6 rounded-lg shadow-sm">
      {/* Author Info */}
      <div className="flex items-center gap-4">
        {/* Author Image */}
        <div className="flex-shrink-0">
          <Image
            src="/images/user_placeholder.png"
            width={100}
            height={100}
            alt="Author Image"
            className="rounded-full object-cover"
          />
        </div>

        {/* Author Text Info */}
        <div>
          <h3 className="text-xl font-bold text-gray-800">Katen Doe</h3>
          <p className="text-sm text-gray-600">
            Hello, I’m a content writer who is fascinated by content fashion,
            celebrity, and lifestyle. She helps clients bring the right content
            to the right people.
          </p>
          <div className="mt-2 flex justify-start gap-1">
            <a
              href="#"
              className="p-2 rounded-full text-[#203656] hover:text-[#fe4f70]"
              aria-label="Link"
            >
              <FontAwesomeIcon icon={faFacebook} size="sm" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full text-[#203656] hover:text-[#fe4f70]"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faInstagram} size="sm" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full text-[#203656] hover:text-[#fe4f70]"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faSnapchat} size="sm" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full text-[#203656] hover:text-[#fe4f70]"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faYoutube} size="sm" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full text-[#203656] hover:text-[#fe4f70]"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} size="sm" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
