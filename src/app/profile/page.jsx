"use client";
import React, { useEffect, useState } from "react";
import { getUser, createWellWisher } from "../../../actions/userActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function fetchUser() {
    try {
      const response = await getUser(localStorage.getItem("token"));
      if (response.success) {
        setUser(response.user);
      } else {
        toast.error(response.error || "Failed to fetch user");
      }
    } catch (err) {
      toast.error("Error fetching user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const generatePasscode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPasscode(randomCode);
  };

  const handleCreateWellWisher = async () => {
    if (!nickname) {
      toast.error("Nickname is required");
      return;
    }
    const userId = user._id;
    try {
      const response = await createWellWisher(userId, nickname, passcode);
      if (response.success) {
        toast.success("Wellwisher created successfully");
        fetchUser();
        setNickname("");
        setPasscode("");
        setIsOpen(false);
      } else {
        toast.error(response.error || "Failed to create wellwisher");
      }
    } catch (err) {
      toast.error("Error creating wellwisher");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone No:</strong> {user.phoneNo}
      </p>
      <p>
        <strong>Message Rooms:</strong> {user.messageRooms.length}
      </p>

      {/* Wellwishers List */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Wellwishers</h3>
        {user.wellwishers && user.wellwishers.length > 0 ? (
          <ul className="list-disc pl-5">
            {user.wellwishers.map((wellwisher, index) => (
              <li key={index}>
                <strong>{wellwisher.nickname}</strong> - {wellwisher.passcode}
              </li>
            ))}
          </ul>
        ) : (
          <p>No wellwishers added yet.</p>
        )}
      </div>

      {/* Add Wellwisher Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={(e) => {
              setIsOpen(true);
              generatePasscode();
            }}
            className="mt-4"
          >
            Add Wellwisher
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Wellwisher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <p>
              <strong>Generated Passcode:</strong>{" "}
              {passcode || "Click to generate"}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateWellWisher}>Create Wellwisher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
