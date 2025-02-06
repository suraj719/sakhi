"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import chatbot from "@/../utils/chatbot";
import { toast } from "sonner";

function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    setIsLoading(true);

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    try {
      const response = await chatbot(input);
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
    } catch (error) {
      toast.error("Failed to fetch response. Please try again.");
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[400px] bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-lg font-semibold">Legal Advice Chatbot</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}>
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              {message.sender === "user" ? (
                <p className="whitespace-pre-wrap">{message.text}</p>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      // Style your markdown components
                      h1: ({ node, ...props }) => (
                        <h1 className="text-xl font-bold my-2" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-lg font-bold my-2" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-md font-bold my-2" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="my-2" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-4 my-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-4 my-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="my-1" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-bold" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic" {...props} />
                      ),
                    }}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
