"use client";
import Image from "next/image";
import { addUser, getUser } from "../../actions/userActions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.error("Login to explore app");
      router.push("/login");
    }
  }, []);
  return <div>Hello World</div>;
}
