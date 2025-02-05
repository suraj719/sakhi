"use client";
import Image from "next/image";
import { addUser, getUser } from "../../actions/userActions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "../../actions/userActions";
export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  async function fetchUsers() {
    const users = await getUsers();
    setUser(users);
  }
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div>
      Hello World<h1>{JSON.stringify(user)}</h1>
    </div>
  );
}
