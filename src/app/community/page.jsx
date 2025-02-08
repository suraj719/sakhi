"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Shield,
  Plus,
  Compass,
  Home,
} from "lucide-react";
import CreateCommunityModal from "@/components/pages/community/communityForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCommunities,
  createCommunity,
  joinCommunity,
  leaveCommunity,
} from "../../../actions/communityActions";
import { getUser } from "../../../actions/userActions";

const CommunityCard = ({ community, onJoin, onLeave, currentUser }) => {
  const isMember = community.members?.includes(currentUser?._id);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-semibold">{community.name}</span>
          {currentUser && (
            <Button
              variant={isMember ? "outline" : "default"}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                isMember ? onLeave(community._id) : onJoin(community._id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity">
              {isMember ? "Leave" : "Join"}
            </Button>
          )}
        </CardTitle>
        <CardDescription>{community.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{community.members?.length || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>{community.posts?.length || 0} posts</span>
          </div>
          {community.isPrivate && (
            <div className="flex items-center gap-1">
              <Shield size={16} />
              <span>Private</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function CommunityPage() {
  const [communities, setCommunities] = useState([]);
  const [user, setUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("explore");

  const fetchUser = useCallback(async () => {
    const response = await getUser(localStorage.getItem("token"));
    if (response.success) {
      setUser(response.user);
    } else {
      toast.error(response.error);
    }
  }, []);

  const fetchCommunities = useCallback(async () => {
    const response = await getCommunities();
    if (response.success) {
      setCommunities(response.communities);
    } else {
      toast.error(response.error);
    }
    setLoading(false);
  }, []);

  const handleCreateCommunity = async (data) => {
    const token = localStorage.getItem("token");
    const response = await createCommunity(data, token);
    if (response.success) {
      toast.success(response.message);
      fetchCommunities();
      setIsCreateModalOpen(false);
    } else {
      toast.error(response.error);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    const token = localStorage.getItem("token");
    const response = await joinCommunity(communityId, token);
    if (response.success) {
      toast.success(response.message);
      fetchCommunities();
    } else {
      toast.error(response.error);
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    const token = localStorage.getItem("token");
    const response = await leaveCommunity(communityId, token);
    if (response.success) {
      toast.success(response.message);
      fetchCommunities();
    } else {
      toast.error(response.error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCommunities();
  }, [fetchUser, fetchCommunities]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredCommunities =
    activeTab === "explore"
      ? communities
      : communities.filter((c) => c.members?.includes(user?._id));

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Communities</h1>
          <p className="mt-2 text-muted-foreground">
            Join communities and connect with others
          </p>
          {user && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-6"
              size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create your own Community
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={activeTab === "explore" ? "default" : "ghost"}
            onClick={() => setActiveTab("explore")}>
            <Compass className="mr-2 h-4 w-4" />
            Explore
          </Button>
          <Button
            variant={activeTab === "joined" ? "default" : "ghost"}
            onClick={() => setActiveTab("joined")}>
            <Home className="mr-2 h-4 w-4" />
            Your Communities
          </Button>
        </div>

        <Separator className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {filteredCommunities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full text-center py-16 text-muted-foreground">
                {activeTab === "explore"
                  ? "No communities found. Be the first to create one!"
                  : "You haven't joined any communities yet."}
              </motion.div>
            ) : (
              filteredCommunities.map((community, index) => (
                <Link href={`/community/${community._id}`} key={community._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}>
                    <CommunityCard
                      community={community}
                      onJoin={handleJoinCommunity}
                      onLeave={handleLeaveCommunity}
                      currentUser={user}
                    />
                  </motion.div>
                </Link>
              ))
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isCreateModalOpen && (
            <CreateCommunityModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateCommunity}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
