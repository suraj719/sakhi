"use client";
import Navbar from "@/components/navbar";
export default function Home() {
  return (
    <div className="h-screen">
      <div className="h-[100%]">
        <Navbar />
      </div>
      <div>
        <h1>Hello World</h1>
      </div>
    </div>
  );
}
