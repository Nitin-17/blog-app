import React, { useState } from "react";
import { adminMenu, userMenu } from "../../lib/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSignOut,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import AdminCard from "../../components/ui/admin-card";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../store/authSlice";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { name, isAdmin } = useSelector((state) => state?.user?.auth);
  console.log("IsAdmin", isAdmin, name);

  const userRole = Cookies.get("userRole");
  console.log("userROle", userRole);
  const handleLogout = async () => {
    setIsOpen(false);

    dispatch(setAuth({ token: "", success: false, name: "", userId: "" }));

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex flex-col gap-4  p-2 pt-6 pb-64">
        <div className="flex flex-row gap-4 items-center justify-between p-2 pt-6">
          <Link href="/" className="hover:text-pink-500">
            <FontAwesomeIcon icon={faArrowLeft} size="xl" />
          </Link>
          <div className="flex flex-row gap-4">
            <span>
              <FontAwesomeIcon
                icon={faUser}
                className="text-2xl text-gray-500"
              />
            </span>
            <h1 className="text-[20px] text-gray-500 font-semibold">
              {userRole === "admin" ? "Admin" : "User"} Dashboard
            </h1>
          </div>
          {/*   <div className=" flex flex-row gap-4 ">
            <span className="text-gray-800 font-semibold">{name}</span>
            <span
              onClick={handleLogout}
              className="hover:text-pink-500 cursor-pointer"
            >
              <FontAwesomeIcon icon={faSignOut} size="lg" />
            </span>
          </div> */}
          <div className="relative">
            <span onClick={togglePopup} className="cursor-pointer">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-3xl text-gray-500"
              />
            </span>

            {isOpen && (
              <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-32 p-4 ">
                <div className="text-sm text-start font-semibold flex w-full justify-start text-gray-700 py-3 relative before:content-[''] before:block before:h-[1px] before:w-full before:absolute before:bottom-0 before:left-0 before:bg-gradient-to-r before:from-[#bebebe] before:to-transparent">
                  {name}
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-start text-gray-600 font-normal py-2 rounded-lg hover:font-semibold "
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-4 flex-wrap mt-6">
          {userRole === "admin"
            ? adminMenu?.map((menuItem) => {
                return (
                  <>
                    <AdminCard menuItem={menuItem} />
                  </>
                );
              })
            : userMenu?.map((menuItem) => {
                return (
                  <>
                    <AdminCard menuItem={menuItem} />
                  </>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
