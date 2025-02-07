import React, { useState } from "react";

export default function PostForm({ onSubmit }) {
  const [postData, setPostData] = useState({ title: "", content: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postData);
    setPostData({ title: "", content: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Post Title"
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Post Content"
            value={postData.content}
            onChange={(e) =>
              setPostData({ ...postData, content: e.target.value })
            }
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Post
        </button>
      </form>
    </div>
  );
}
