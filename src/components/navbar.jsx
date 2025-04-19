"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaPlane,
  FaLifeRing,
  FaUsers,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdSos } from "react-icons/md";
import { IoLogoWechat } from "react-icons/io5";
import Link from "next/link";

function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  
  return (
    <>
      {pathname !== "/" && (
        <div
          className="navbar h-[100%] ml-2 z-10 fixed flex flex-col justify-center"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}>
          <div className="hidden md:block fixed left-0 top-0 w-2 h-full bg-transparent z-10" />

          <div
            className={`
              flex md:flex-col md:rounded-lg shadow-black shadow-xl justify-around 
              items-center bg-[#dc2446] text-white p-2 w-full md:w-[75px] 
              fixed bottom-0 left-0 md:relative md:bottom-auto md:top-0 md:pl-4 md:h-[90%]
              md:transition-transform md:duration-300 md:ease-in-out
              ${isVisible ? "md:translate-x-0" : "md:translate-x-[-95%]"}
            `}>
            <NavItem path="/home" current={pathname} icon={<FaHome />} />
            <NavItem path="/travel" current={pathname} icon={<FaPlane />} />
            <NavItem path="/navigate" current={pathname} icon={<FaMapMarkerAlt />} />
            <NavItem path="/sos" current={pathname} icon={<MdSos />} />
            {/* <div className="w-full flex-1 text-center md:text-left flex items-center md:flex-row md:gap-4">
              <Link href="/sos">
                <p className="mx-auto font-black text-xl rounded-full">SOS</p>
              </Link>
            </div> */}
            <NavItem path="/chatrooms" current={pathname} icon={<IoLogoWechat />} />
            <NavItem path="/community" current={pathname} icon={<FaUsers />} />
            <NavItem path="/profile" current={pathname} icon={<FaUser />} />
          </div>
        </div>
      )}{" "}
      <div></div>
    </>
  );
}

// Helper component for consistent nav items
function NavItem({ path, current, icon }) {
  const isActive = current === path;
  
  return (
    <div className="w-full flex-1 text-center md:text-left p-2 flex items-center md:flex-row md:gap-4">
      <Link href={path} className="w-full flex justify-center">
        <div 
          className={`
            flex items-center justify-center p-2
            ${isActive ? "bg-white text-[#dc2446] rounded-md" : "text-white"}
          `}
        >
          {React.cloneElement(icon, { 
            className: "text-2xl", // Consistent size regardless of active state
          })}
        </div>
      </Link>
    </div>
  );
}

export default Navbar;