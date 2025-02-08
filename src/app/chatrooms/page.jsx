"use client";
import React, { useEffect, useState } from "react";
import {
  fetchUserRooms,
  sendMessage,
  fetchMessages,
  getRoomDetails,
} from "../../../actions/chatRoomActions";
import { getUser } from "../../../actions/userActions";
import { toast } from "sonner";
import { Search, Send, Users, Menu, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ChatRooms = () => {
  const [userRooms, setUserRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function fetchRooms() {
    try {
      const response = await fetchUserRooms(localStorage.getItem("token"));
      setUserRooms(response);
    } catch (error) {
      toast.error("Failed to fetch user rooms");
    }
  }

  async function fetchRoomMessages(roomId) {
    const response = await fetchMessages(roomId);
    setMessages(response);
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const response = await sendMessage(
        selectedRoom,
        newMessage,
        localStorage.getItem("token")
      );
      if (response.success) {
        toast.success("Message sent successfully");
        setNewMessage("");
        fetchRoomMessages(selectedRoom);
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  }

  async function fetchUser() {
    const response = await getUser(localStorage.getItem("token"));
    setUser(response.user);
  }

  async function fetchRoomDetails() {
    try {
      const response = await getRoomDetails(selectedRoom);
      if (response.success) {
        setRoomDetails(response.room);
      }
    } catch (err) {
      toast.error("Failed to fetch room details");
    }
  }

  useEffect(() => {
    fetchRooms();
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchRoomMessages(selectedRoom);
      fetchRoomDetails();
      const interval = setInterval(() => fetchRoomMessages(selectedRoom), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom]);

  const filteredRooms = userRooms.filter((room) =>
    room.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ChatRoomList = () => (
    <div className="flex flex-col max-h-screen">
      <div className="p-4">
        <Input
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 px-4">
          {filteredRooms.map((room) => (
            <div key={room.roomId}>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedRoom === room.roomId
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => {
                  setSelectedRoom(room.roomId);
                  setIsMobileMenuOpen(false);
                }}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{room.title}</CardTitle>
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      {room.participantCount}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex h-full bg-background">
      {/* Mobile Menu Button */}
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="lg:hidden fixed top-6 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(true)}>
        <Menu className="w-6 h-6" />
      </Button>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetHeader className="p-4">
            <SheetTitle className="pl-12">Chat Rooms</SheetTitle>
          </SheetHeader>
          <ChatRoomList />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[300px] border-r">
        <ChatRoomList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col ml-12 md:ml-0">
                  <h2 className="text-xl font-bold">
                    {roomDetails?.title || "Chat"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {roomDetails?.participants?.length || 0} participants
                  </p>
                </div>
                {roomDetails && (
                  <div className="flex -space-x-2">
                    {roomDetails.participants.slice(0, 3).map((participant) => (
                      <Avatar key={participant.userId}>
                        <AvatarFallback>
                          {participant.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {roomDetails.participants.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                        +{roomDetails.participants.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === user?._id ? "justify-end" : "justify-start"
                    }`}>
                    <div
                      className={`flex items-start gap-2 space-x-2 max-w-[70%] ${
                        msg.sender === user?._id ? "flex-row-reverse" : ""
                      }`}>
                      <Avatar className="w-10  h-10">
                        <AvatarFallback className="bg-slate-200">
                          {msg.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg py-3 px-5  ${
                          msg.sender === user?._id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}>
                        <p className="text-sm font-medium mb-1">
                          {msg.username}
                        </p>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" className="bg-[#dc2446] p-4">
                  <Send className="w-4 h-4 mr-2 " />
                  Send
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Welcome to Chat</h3>
              <p className="text-muted-foreground">
                Select a room to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRooms;
