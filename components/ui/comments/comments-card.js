"use client"; // If using Next.js app directory

import React, { useState, useEffect } from "react";
import {
  faComment,
  faThumbsUp,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { formatDate } from "../../../lib/helpers";

const CommentsCard = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setStatus(true);
        const response = await fetch("/api/get-comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        });
        const data = await response.json();
        if (data?.success) {
          setMessage(data);
          setComments(data?.comments);
          setStatus(false);
        } else {
          setMessage(data);
          setStatus(false);
          console.error("Failed to save category.");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setStatus(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  if (status) {
    return <div>Loading comments...</div>;
  }

  if (!comments.length) {
    return <div>No comments yet. Be the first to comment!</div>;
  }

  return (
    <div>
      <div
        key={comment._id}
        className="mx-auto p-4 border rounded-lg shadow-sm bg-white mb-4"
      >
        {comments?.map((comment) => (
          <>
            <div className="flex items-center space-x-4 mt-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                <Image
                  src="/images/user.png"
                  alt="User Avatar"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {comment.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(comment.date) || "Just now"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{comment?.comment}</p>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-700 py-3 relative before:content-[''] before:block before:h-[1px] before:w-full before:absolute before:bottom-0 before:left-0 before:bg-gradient-to-r before:from-[#bebebe] before:to-transparent">
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-purple-600">
                  <FontAwesomeIcon icon={faComment} size="sm" />
                  <span>33</span>
                </button>
                <button className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faThumbsUp} size="sm" />
                  <span>0</span>
                </button>
              </div>
              <button className="flex items-center space-x-1">
                <FontAwesomeIcon icon={faReply} size="sm" />
                <span>Reply</span>
              </button>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default CommentsCard;
