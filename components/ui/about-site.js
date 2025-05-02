import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

const AboutSite = () => {
  return (
    <div className="relative z-10 flex flex-col justify-center items-center gap-4 md:col-span-1 border border-gray-200 rounded-lg w-[300px] bg-white p-6 text-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/map-bg.png"
          alt="Background Map"
          fill
          style={{ objectFit: "contain" }}
          quality={100}
          className="rounded-lg"
        />
      </div>

      <h2 className="text-3xl font-bold text-gray-800">Apollo</h2>

      <p className="text-gray-600 mb-4 text-sm">
        Hello, We’re content writers who are fascinated by content fashion,
        celebrity, and lifestyle. We help clients bring the right content to the
        right people.
      </p>

      {/* Social Media Icons */}
      <div className="flex justify-center items-center space-x-4">
        {[faInstagram, faFacebook, faTwitter, faYoutube, faPinterest].map(
          (icon, index) => (
            <a
              key={index}
              href="#"
              className="text-gray-700 hover:text-pink-500 transition-colors duration-300"
              aria-label={`Visit our ${icon.iconName} page`}
            >
              <FontAwesomeIcon icon={icon} size="md" />
            </a>
          )
        )}
      </div>
    </div>
  );
};

export default AboutSite;
