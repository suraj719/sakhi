import React from "react";
import { FaHome, FaPlane, FaLifeRing, FaUsers, FaUser } from "react-icons/fa";

function Navbar() {
  return (
    <div className="flex md:flex-col  justify-around items-center bg-[#dc2446] text-white p-2 w-full md:w-[12%] fixed bottom-0 left-0 md:relative md:bottom-auto md:top-0 md:pl-4 md:h-full">
      <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
        <FaHome className="mx-auto  text-2xl" />
      </div>
      <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
        <FaPlane className="mx-auto  text-2xl" />
      </div>
      <div className="w-full flex-1 text-center md:text-left  flex items-center  md:flex-row md:gap-4">
        <p className="mx-auto  font-black text-xl rounded-full ">SOS</p>
      </div>
      <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
        <FaUsers className="mx-auto  text-3xl" />
      </div>
      <div className="w-full flex-1 text-center md:text-left p-2 flex items-center  md:flex-row md:gap-4">
        <FaUser className="mx-auto  text-2xl" />
      </div>
    </div>
  );
}

export default Navbar;
