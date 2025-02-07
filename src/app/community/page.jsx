"use client";
import { useEffect, useState, useCallback } from "react";
import CreateCommunityModal from "@/components/pages/community/communityForm";
import CommunityCard from "@/components/pages/community/communityCard";
import { toast } from "sonner";
import { getUser } from "../../../actions/userActions";
import {
  getCommunities,
  createCommunity,
  joinCommunity,
  leaveCommunity,
} from "../../../actions/communityActions";
import Link from "next/link";

export default function CommunityPage() {
  const [communities, setCommunities] = useState([]);
  const [user, setUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Communities</h1>
          {user && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Create Community
            </button>
          )}
        </div>

        {communities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No communities found. Be the first to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link href={`/community/${community._id}`} key={community._id}>
                <CommunityCard
                  key={community._id}
                  community={community}
                  onJoin={handleJoinCommunity}
                  onLeave={handleLeaveCommunity}
                  currentUser={user}
                />
              </Link>
            ))}
          </div>
        )}

        <CreateCommunityModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCommunity}
        />
      </div>
    </div>
  );
}
