"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

const page = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
    }
  });
  return <div>page</div>;
};

export default page;
