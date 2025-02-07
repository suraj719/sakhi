"use client";
import React, { useState } from "react";

export default function PostCard({
  post,
  onComment,
  isCommenting,
  onCancelComment,
  onSubmitComment,
}) {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    onSubmitComment(commentText);
    setCommentText("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <div className="text-sm text-gray-500 mb-4">
        Posted by {post.author?.username || "Unknown"} on{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </div>

      <div className="mt-4">
        <h4 className="font-bold mb-2">
          Comments ({post.comments?.length || 0})
        </h4>
        {post.comments?.map((comment, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded mb-2">
            <p className="text-gray-800">{comment.comment}</p>
            <p className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}

        {!isCommenting ? (
          <button
            onClick={() => onComment(post._id)}
            className="text-blue-500 mt-2 text-sm">
            Add Comment
          </button>
        ) : (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="mt-2 space-x-2">
              <button
                onClick={handleCommentSubmit}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                Post Comment
              </button>
              <button
                onClick={onCancelComment}
                className="text-gray-500 px-3 py-1 rounded text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
