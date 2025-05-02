import Image from "next/image";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import { faShare, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { extractFirstPText, formatDateSlug } from "../../../lib/helpers";
import slugify from "slugify";
import Link from "next/link";
import Pagination from "../pagination/pagination";

const LatestPosts = ({ posts }) => {
  const [showSocialIcons, setShowSocialIcons] = useState(false);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const currentPosts = posts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePost = (id) => {
    const post = posts?.find((post) => post?._id === id);
    const postSlug = post ? slugify(post?.title, { lower: true }) : "untitled";
    return postSlug;
  };

  return (
    <div className="col-span-1 w-full border-[1px] rounded-lg px-8 bg-white">
      {/* Upper Section */}
      <div className="flex flex-col gap-6 mb-8">
        {currentPosts?.map((article, index) => (
          <div
            className="flex flex-row items-start gap-4 pt-6 pb-4 border-b border-gray-200 rounded-lg shadow-sm"
            key={`${article.id || article.title}-${index}`}
          >
            {/* Article Image */}
            <div className="relative w-64 h-48 flex-shrink-0">
              <Image
                src={
                  article.image
                    ? `data:${article.image.mime};${article.image.encoding},${article.image.data}`
                    : `/images/user_placeholder.png`
                }
                width={300}
                height={300}
                alt={article.title || "Article image"}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
              />
              <span
                className={`absolute top-2 left-2 ${
                  article.category === "Fashion"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                } text-white text-xs px-2 py-1 rounded-md`}
              >
                {article.category}
              </span>
            </div>

            {/* Article Details */}
            <div className="flex flex-col justify-between flex-grow gap-2">
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Image
                  src={
                    article.authorImage
                      ? article.authorImage
                      : `/images/user_placeholder.png`
                  }
                  width={32}
                  height={32}
                  alt={article.author || "Author"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-[#fe4f70]">•</span>
                <span>{article?.author || "Unknown Author"}</span>
                <span className="text-[#fe4f70]">•</span>
                <span>{article.date || "Unknown Date"}</span>
              </div>

              <div>
                <Link
                  href={{
                    pathname: `/blog/posts/${formatDateSlug(
                      article?.date
                    )}/${handlePost(article?._id)}`,
                  }}
                >
                  <h3 className="mt-2 text-lg font-semibold text-gray-800 hover:text-pink-500 cursor-pointer">
                    {article.title || "Article Title"}
                  </h3>
                </Link>
                <p className="mt-2 text-sm text-[#7a7a7a] line-clamp-3 font-normal">
                  {extractFirstPText(JSON.stringify(article?.content)) ||
                    "Description not available for this article."}
                </p>
              </div>
              <div className="mt-4">
                {showSocialIcons == false ? (
                  <span
                    className="font-medium cursor-pointer"
                    onClick={() => setShowSocialIcons(true)}
                  >
                    <FontAwesomeIcon
                      icon={faShare}
                      size="md"
                      className="text-gray-500"
                    />
                  </span>
                ) : (
                  <div className="flex flex-row gap-4  items-center">
                    <span
                      className="font-medium cursor-pointer"
                      onClick={() => setShowSocialIcons(false)}
                    >
                      <FontAwesomeIcon
                        icon={faEllipsis}
                        size="md"
                        className="text-gray-500"
                      />
                    </span>

                    <span
                      className="flex w-28 justify-between text-gray-700 
                    relative before:content-[''] before:block before:h-[1px]
                    before:w-full before:absolute before:bottom-0 before:left-0
                    before:bg-gradient-to-r before:from-[#bebebe]
                    before:to-transparent"
                    ></span>
                    <span className="flex flex-row gap-1">
                      <a
                        href="#"
                        className="text-[#8f9bad] hover:text-[#fe4f70]"
                      >
                        <FontAwesomeIcon icon={faFacebook} size="sm" />
                      </a>
                      <a
                        href="#"
                        className="text-[#8f9bad] hover:text-[#fe4f70]"
                      >
                        <FontAwesomeIcon icon={faInstagram} size="sm" />
                      </a>
                      <a
                        href="#"
                        className="text-[#8f9bad] hover:text-[#fe4f70]"
                      >
                        <FontAwesomeIcon icon={faPinterest} size="sm" />
                      </a>
                      <a
                        href="#"
                        className="text-[#8f9bad] hover:text-[#fe4f70]"
                      >
                        <FontAwesomeIcon icon={faYoutube} size="sm" />
                      </a>
                      <a
                        href="#"
                        className="text-[#8f9bad] hover:text-[#fe4f70]"
                      >
                        <FontAwesomeIcon icon={faTwitter} size="sm" />
                      </a>
                    </span>
                  </div>
                )}
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

export default LatestPosts;
