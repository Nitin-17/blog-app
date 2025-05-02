import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import slugify from "slugify";
import { formatDateSlug } from "../../../lib/helpers";

const PopularRecentPosts = (props) => {
  let { posts } = props;
  posts = posts.slice(0, 5);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Popular");

  const handleTabSwitch = (tab) => {
    if (tab !== activeTab) {
      setIsLoading(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handlePost = (id) => {
    const post = posts?.find((post) => post?._id === id);
    const postSlug = post ? slugify(post?.title, { lower: true }) : "untitled";
    return postSlug;
  };

  return (
    <>
      <div className="md:col-span-1 border-[1px] rounded-lg p-4 w-[300px]">
        <div className="space-y-4">
          {/* Tab Buttons */}
          <div className="flex flex-row justify-center gap-6">
            <button
              onClick={() => handleTabSwitch("Popular")}
              className={`px-8 py-2 rounded-full ${
                activeTab === "Popular"
                  ? "text-white  bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387]"
                  : "text-gray-700 bg-gray-200"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => handleTabSwitch("Recent")}
              className={`px-8 py-2 rounded-full ${
                activeTab === "Recent"
                  ? "text-white bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387]"
                  : "text-gray-700 bg-gray-200"
              }`}
            >
              Recent
            </button>
          </div>

          {/* Spinner or Content */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-16">
                {/* Spinner */}
                <div className="mt-32 w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              posts.length > 0 &&
              posts?.map((article, index) => (
                <>
                  <div
                    key={index}
                    className="flex items-start justify-start space-x-4"
                  >
                    <div className="min-w-12 h-12 relative rounded-full overflow-hidden">
                      <Image
                        src={
                          article?.image
                            ? `data:${article?.image?.mime};${article?.image?.encoding},${article?.image?.data}`
                            : `/images/no-preview`
                        }
                        alt={article.title}
                        fill
                        className="object-cover cursor-pointer group-hover:scale-125 transition-transform duration-500 "
                      />
                    </div>
                    <div>
                      <Link
                        href={{
                          pathname: `/blog/posts/${formatDateSlug(
                            article?.date
                          )}/${handlePost(article?._id)}`,
                        }}
                      >
                        <h3 className="text-[14px] font-bold text-[#203656] hover:text-[#fe4f70] cursor-pointer">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">{article.date}</p>
                    </div>
                  </div>
                </>
              ))
            )}
          </div>
          <>
            {/*    <div>
              {Array(5 - posts.length)
                .fill(0)
                .map((_, index) => (
                  <div
                    className="bg-gray-100 animate-pulse rounded-lg shadow-sm mb-2"
                    key={index}
                  >
                    <div className="flex items-start justify-center">
                      <div className="w-1/3 flex-shrink-0 rounded-lg bg-gray-200 h-20 mb-2"></div>
                      <div className="w-2/3 px-2">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div> */}
          </>
        </div>
      </div>
    </>
  );
};

export default PopularRecentPosts;
