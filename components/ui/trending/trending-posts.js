import Image from "next/image";
import React, { useState } from "react";
import { extractFirstPText, formatDateSlug } from "../../../lib/helpers";
import Link from "next/link";
import slugify from "slugify";
import Pagination from "../pagination/pagination";

const TrendingPosts = ({ posts }) => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const currentPosts = posts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const upperPosts = currentPosts.slice(0, 2); // First two posts
  const lowerPosts = currentPosts.slice(2); // Remaining posts

  const handlePost = (id) => {
    const post = posts?.find((post) => post?._id === id);
    const postSlug = post ? slugify(post?.title, { lower: true }) : "untitled";
    return postSlug;
  };

  return (
    <div className="col-span-3 w-full h-fit  border-[1px] rounded-lg px-8">
      {/* Upper Section */}
      <div className="grid grid-cols-1 h-fit md:grid-cols-2 gap-6 mb-8">
        {upperPosts.map((article, index) => (
          <div className="bg-white pt-10 rounded-lg shadow-sm" key={index}>
            {/* Article Image */}
            <div className="relative group">
              <Image
                src={
                  article.image
                    ? `data:${article.image.mime};${article.image.encoding},${article.image.data}`
                    : `/images/user_placeholder.png`
                }
                width={400}
                height={200}
                alt={article.title || "Article image"}
                className="w-full rounded-lg hover:text-[#fe4f70] cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
              />
              <span
                className={`absolute top-4 left-4 ${
                  article.category === "Fashion"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                } text-white text-xs px-2 py-1 rounded-md`}
              >
                {article.category}
              </span>
            </div>

            {/* Article Details */}
            <div className="mt-4 mb-2">
              <div className="flex items-center text-sm text-gray-500 space-x-2 group">
                <Image
                  src={
                    article.authorImage
                      ? article.authorImage
                      : `/images/user_placeholder.png`
                  }
                  width={32}
                  height={32}
                  alt={article.author || "Author"}
                  className="w-8 h-8 rounded-full  hover:text-[#fe4f70] cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
                />
                <span>{article.author || "Unknown Author"}</span>
                <span>•</span>
                <span>{article.date || "Unknown Date"}</span>
              </div>
              <Link
                href={{
                  pathname: `/blog/posts/${formatDateSlug(
                    article?.date
                  )}/${handlePost(article?._id)}`,
                }}
              >
                <h3 className="mt-2 text-lg font-semibold text-[#203656] hover:text-[#fe4f70] cursor-pointer">
                  {article.title || "Article Title"}
                </h3>
              </Link>
              <p className="mt-2 text-sm text-[#7a7a7a] line-clamp-3 font-normal">
                {extractFirstPText(JSON.stringify(article?.content)) ||
                  "Description not available for this article."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Section */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
        {lowerPosts.length == 0
          ? // Shimmer placeholders
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  className="bg-gray-100 animate-pulse rounded-lg shadow-sm mb-2"
                  key={index}
                >
                  <div className="flex items-start justify-center">
                    <div className="w-1/3 flex-shrink-0 rounded-lg bg-gray-200 h-24"></div>
                    <div className="w-2/3 px-2">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
          : // Actual content
            lowerPosts.map((article, index) => (
              <div className="bg-white rounded-lg shadow-sm mb-2" key={index}>
                <div className="flex items-start justify-center">
                  {/* Article Image */}
                  <div className="w-1/3 flex-shrink-0 rounded-lg">
                    <Image
                      src={
                        article.image
                          ? `data:${article.image.mime};${article.image.encoding},${article.image.data}`
                          : `/images/no-preview`
                      }
                      width={100}
                      height={100}
                      alt={article.title || "Article image"}
                      className="w-full h-full object-cover rounded-l-lg hover:text-[#fe4f70] cursor-pointer"
                    />
                  </div>
                  <div className="w-2/3 px-2">
                    <Link
                      href={{
                        pathname: `/blog/posts/${formatDateSlug(
                          article?.date
                        )}/${handlePost(article?._id)}`,
                      }}
                    >
                      <h3 className="text-md font-semibold text-[#203656] hover:text-[#fe4f70] cursor-pointer">
                        {article.title || "Article Title"}
                      </h3>
                    </Link>
                    <div className="text-sm text-gray-500">
                      <span>{article.date || "Unknown Date"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TrendingPosts;
