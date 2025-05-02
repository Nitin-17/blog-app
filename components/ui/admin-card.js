import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const AdminCard = ({ menuItem }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-4">
      <div className="relative bg-gradient-to-r from-orange-300 to-pink-400 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
        {/* Background Effects */}
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-30px] left-[-40px] w-56 h-56 bg-white opacity-10 rounded-full blur-2xl"></div>

        {/* Content */}
        <div className="relative flex flex-col items-center p-6 text-white">
          {/* Icon */}
          <div className="p-5 border border-white rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon
              icon={menuItem.icon}
              className="text-3xl text-white"
            />
          </div>

          {/* Button */}
          <Link
            href={`/admin/panel/${menuItem.id}`}
            prefetch={true}
            className="mt-4 bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387] text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {menuItem.value}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
