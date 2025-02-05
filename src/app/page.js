"use client";
import Image from "next/image";
import { addUser, getUser } from "../../actions/userActions";
import { useState, useEffect } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function createUser(e) {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await addUser({ username, email, password });
      if (response.success) console.log(response.user);
    } catch (err) {
      console.log(response.error);
    } finally {
      setLoading(false);
    }
  }
  async function fetchUsers() {
    const response = await getUser();
    console.log(response);
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <form onSubmit={createUser}>
        <input
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Enter password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{loading ? "Adding user" : "Add User"}</button>
      </form>
    </div>
  );
}
