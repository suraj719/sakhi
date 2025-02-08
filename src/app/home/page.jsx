"use client";
import React, { useEffect } from "react";


const page = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
    }
  });
  return <div>page</div>;
};

export default page;
