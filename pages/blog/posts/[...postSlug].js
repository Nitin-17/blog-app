import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";
import ExploreTopics from "../../../components/ui/trending/explore-topics";
import Breadcrumb from "../../../components/ui/breadcrumb";
import PopularPosts from "../../../components/ui/popular-posts/popular-posts";
import AuthorCard from "../../../components/ui/author-card";
import CommentForm from "../../../components/ui/forms/comment-form";
import AboutSite from "../../../components/ui/about-site";
import CommentsCard from "../../../components/ui/comments/comments-card";

const PostPage = () => {
  const router = useRouter();
  const { postSlug } = router.query;
  const storedPosts = useSelector((state) => state.posts.posts);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState(false);
  const [comments, setComments] = useState([]);

  const searchParams = Array.isArray(postSlug)
    ? postSlug[postSlug.length - 1]?.replaceAll("-", " ").toLowerCase()
    : postSlug?.replaceAll("-", " ").toLowerCase();

  const singlePost = storedPosts?.find(
    (post) => post?.title?.toLowerCase() === searchParams
  );

  const handleSubmit = async (commentData) => {
    try {
      setStatus(true);
      const response = await fetch("/api/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...commentData, postId: singlePost?._id }),
      });
      const data = await response.json();
      if (data?.success) {
        setMessage(data);
        setStatus(false);
      } else {
        setMessage(data);
        setStatus(false);
        console.error("Failed to save comment.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="col-span-1 w-full  rounded-lg px-8 bg-white ">
        <div className="flex flex-row gap-6 mb-8">
          <div className=" bg-white pt-2 rounded-lg ">
            <Breadcrumb category={singlePost?.category} title={searchParams} />
            <div className="flex flex-col gap-6 mt-1 mb-2">
              <h3 className="mt-2 text-4xl font-bold text-[#203656] leading-10">
                {singlePost?.title || "singlePost? Title"}
              </h3>
              <div className="flex items-center text-sm text-gray-500 space-x-2 group">
                <Image
                  src={
                    singlePost?.authorImage
                      ? singlePost?.authorImage
                      : `/images/user_placeholder.png`
                  }
                  width={32}
                  height={32}
                  alt={singlePost?.author || "Author"}
                  className="w-8 h-8 rounded-full  hover:text-[#fe4f70] cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
                />
                <span>{singlePost?.author || "Unknown Author"}</span>
                <span>•</span>
                <span>{singlePost?.category || "Unknown Category"}</span>
                <span>•</span>
                <span>{singlePost?.date || "Unknown Date"}</span>
              </div>

              <div>
                <Image
                  src={
                    singlePost?.image
                      ? `data:${singlePost?.image.mime};${singlePost?.image.encoding},${singlePost?.image.data}`
                      : `/images/user_placeholder.png`
                  }
                  width={800}
                  height={200}
                  alt={singlePost?.title || "singlePost? image"}
                  className="h-fit object-fill rounded-lg hover:text-[#fe4f70] cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <p
                className="content-container mt-2 text-md text-[#7a7a7a] font-normal"
                dangerouslySetInnerHTML={{ __html: singlePost?.content }}
              ></p>
            </div>

            <div>
              <AuthorCard />
            </div>
            <div className="flex flex-col justify-start gap-6">
              <CommentForm
                handleSubmit={(data) => handleSubmit(data)}
                status={status}
              />
              <CommentsCard postId={singlePost?._id} />
            </div>
          </div>
          <div className="flex flex-col gap-10 mt-10">
            <ExploreTopics posts={storedPosts} />
            <PopularPosts posts={storedPosts} />
            <AboutSite />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
