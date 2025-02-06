import React from "react";
import {
  FaHome,
  FaPlane,
  FaLifeRing,
  FaUsers,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";

function Navbar() {
  return (
    <div className="navbar h-[100%] ml-2  flex flex-col justify-center ">
      <div className="flex md:flex-col md:rounded-lg shadow-black shadow-xl  justify-around items-center bg-[#dc2446] text-white p-2 w-full md:w-[75px] fixed bottom-0 left-0 md:relative md:bottom-auto md:top-0 md:pl-4 md:h-[90%]">
        <div className=" w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
          <FaHome className="mx-auto  text-2xl" />
        </div>
        <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
          <FaPlane className="mx-auto  text-2xl" />
        </div>
        <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
          <FaMapMarkerAlt className="mx-auto  text-2xl" />
        </div>
        <div className="w-full flex-1 text-center md:text-left  flex items-center  md:flex-row md:gap-4">
          <p className="mx-auto  font-black text-xl rounded-full ">SOS</p>
        </div>
        <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
          <IoLogoWechat className="mx-auto  text-4xl" />
        </div>
        <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
          <FaUsers className="mx-auto  text-3xl" />
        </div>
        <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
          <FaUser className="mx-auto  text-2xl" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
