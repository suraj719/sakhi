"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  getWellWisherData,
  updateEmailWellWisher,
  updatePhnoWellWisher,
} from "../../../actions/userActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wellwisher, setWellwisher] = useState(null);
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const fetched = useRef(false);

  async function fetchWellWisherData() {
    const token = localStorage.getItem("wellwisher");

    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    setLoading(true);
    try {
      const res = await getWellWisherData(token);
      console.log("Response received:", res);

      if (res.success) {
        setUser(res.username);
        setWellwisher(res.wellWisher);
        setEmail(res.wellWisher.email || "");
        setPhoneNo(res.wellWisher.phoneNo || "");
        toast.message("Data fetched successfully.");
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditEmail() {
    try {
      const res = await updateEmailWellWisher(email, wellwisher.passcode, user);
      if (res.success) {
        toast.success("Email updated successfully.");
        fetchWellWisherData();
        setEditEmail(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleEditPhoneNo() {
    try {
      const res = await updatePhnoWellWisher(
        phoneNo,
        wellwisher.passcode,
        user
      );
      if (res.success) {
        toast.success("Phone number updated successfully.");
        fetchWellWisherData();
        setEditPhone(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (!fetched.current) {
      fetchWellWisherData();
      fetched.current = true;
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle>{user || "Wellwisher"}</CardTitle>
          </CardHeader>
          <CardContent>
            {wellwisher && (
              <div>
                <h2 className="text-lg font-semibold">
                  Nickname: {wellwisher.nickname}
                </h2>
                <h3 className="text-md text-gray-600">
                  Passcode: {wellwisher.passcode}
                </h3>
                <div className="mt-4">
                  <label className="text-sm font-medium">Email:</label>
                  {editEmail ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button onClick={handleEditEmail}>Save</Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditEmail(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border rounded p-2 mt-1">
                      <span>{email || "Not provided"}</span>
                      <Button
                        variant="outline"
                        onClick={() => setEditEmail(true)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium">Phone No:</label>
                  {editPhone ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="text"
                        placeholder="Enter phone number"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                      />
                      <Button onClick={handleEditPhoneNo}>Save</Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditPhone(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border rounded p-2 mt-1">
                      <span>{phoneNo || "Not provided"}</span>
                      <Button
                        variant="outline"
                        onClick={() => setEditPhone(true)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
