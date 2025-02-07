"use client";
import React from "react";

export default function CommunityCard({
  community,
  onJoin,
  onLeave,
  currentUser,
}) {
  if (!community) return null;

  const isMember =
    currentUser &&
    community.members?.some((member) => member._id === currentUser._id);

  const isAdmin = currentUser && community.admin?._id === currentUser._id;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold">{community.name}</h3>
      <p className="text-gray-600 mt-2">{community.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <span>{community.members?.length || 0} members</span>
          <span className="mx-2">•</span>
          <span>{community.posts?.length || 0} posts</span>
          {isAdmin && (
            <>
              <span className="mx-2">•</span>
              <span className="text-blue-500">Admin</span>
            </>
          )}
        </div>
        {currentUser && !isAdmin && (
          <button
            onClick={() => {
              if (!community._id) return;
              isMember ? onLeave(community._id) : onJoin(community._id);
            }}
            className={`px-4 py-2 rounded ${
              isMember
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}>
            {isMember ? "Leave" : "Join"} Community
          </button>
        )}
      </div>
    </div>
  );
}
