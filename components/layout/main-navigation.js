import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faAngleDown,
  faSignIn,
  faUserPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import { navigationMenu } from "../../lib/menu";
import { useSelector } from "react-redux";
import useAuthTokenValidator from "../auth/useAuthTokenValidator";

const MainNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = useSelector((state) => state?.user?.auth?.token);

  useAuthTokenValidator();

  return (
    <header className="bg-white z-50">
      <div className="max-w-screen-xl flex items-center py-10 px-2 gap-16">
        <div className="text-4xl font-bold text-black-900 flex items-center gap-2">
          <Link href="/">Apollo</Link>
          <span className="text-pink-500">.</span>
        </div>

        <nav className="hidden md:flex space-x-6 items-center text-[#79889e] gap-4">
          {navigationMenu?.map((menu) => (
            <div key={menu.id} className="relative group">
              <Link href={`/blog/category/${menu.id}`} passHref legacyBehavior>
                <a className="flex flex-row font-medium hover:text-black text-[14px]">
                  <span>{menu.value}</span>
                  {menu.items && (
                    <span className="ml-2">
                      <FontAwesomeIcon icon={faAngleDown} size="xs" />
                    </span>
                  )}
                </a>
              </Link>

              {/* Dropdown for Sub-items */}
              {menu.items && (
                <div className="absolute left-0 top-full mt-[-8px] w-48 bg-white rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform group-hover:translate-y-2 ">
                  {menu.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/blog/category/${item.id}`}
                      passHref
                      legacyBehavior
                    >
                      <a className="block px-4 py-2 text-[14px] text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-200 ">
                        {item.value}
                      </a>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Social Media Icons */}
        <div className="flex flex-row justify-center items-center gap-10 ml-16">
          <div className="hidden md:flex space-x-4">
            {[faInstagram, faFacebook, faTwitter, faYoutube, faPinterest].map(
              (icon, index) => (
                <a key={index} href="#" className="hover:text-[#f59274]">
                  <FontAwesomeIcon icon={icon} />
                </a>
              )
            )}
          </div>

          {!token ? (
            <div className="hidden md:flex space-x-4">
              <Link href={`/login`} passHref legacyBehavior>
                <a
                  href="#"
                  className="text-white bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387] p-3 rounded-full flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faSignIn} />
                </a>
              </Link>
              <Link href={`/signup`} passHref legacyBehavior>
                <a
                  href="#"
                  className="text-white bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387] p-3 rounded-full flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                </a>
              </Link>
            </div>
          ) : (
            <Link href={`/admin`} passHref legacyBehavior>
              <a
                href="#"
                className="text-white bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387] p-3 rounded-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faUser} />
              </a>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-black"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          {navigationMenu.map((menu) => (
            <div key={menu.id}>
              <Link href={`/${menu.id}`} passHref>
                <a className="block text-blue-900 font-medium mb-2">
                  {menu.value}
                </a>
              </Link>
              {menu.items && (
                <div className="pl-4">
                  {menu.items.map((item) => (
                    <Link key={item.id} href={`/${item.id}`} passHref>
                      <a className="block text-gray-700 font-medium mb-2">
                        {item.value}
                      </a>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default MainNavigation;
