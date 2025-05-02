import Image from "next/image";
import React from "react";
import LinearSvg from "../linear-svg";
import slugify from "slugify";
import Link from "next/link";
import { formatDateSlug } from "../../../lib/helpers";

const PopularPosts = (props) => {
  let { posts } = props;

  posts = posts.slice(0, 4);

  const handlePost = (id) => {
    const post = posts?.find((post) => post?._id === id);
    const postSlug = post ? slugify(post?.title, { lower: true }) : "untitled";
    return postSlug;
  };

  return (
    <>
      <div className="md:col-span-1 border-[1px] rounded-lg p-4 w-[300px]">
        <div className="space-y-4">
          <div className=" flex flex-row justify-center items-center h-fit">
            <h2 className="text-lg font-[800] text-[#203656] text-center ">
              Popular Topics
            </h2>
          </div>
          <div className="flex justify-center pb-4 px-2">
            <LinearSvg />
          </div>
          <div className="space-y-8 ">
            {posts.length > 0 &&
              posts?.map((article, index) => (
                <div
                  key={index}
                  className="flex items-start justify-start space-x-4 text-gray-300 py-2 relative before:content-[''] before:block before:h-[.5px] before:w-full before:absolute before:bottom-0 before:left-0 before:bg-gradient-to-l before:from-[#bebebe] before:to-transparent"
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
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PopularPosts;
