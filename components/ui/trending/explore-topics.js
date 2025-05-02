import React from "react";
import LinearSvg from "../linear-svg";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import slugify from "slugify";
import Link from "next/link";

const ExploreTopics = (props) => {
  const { posts } = props;

  const topics = posts.reduce((acc, post) => {
    const found = acc.find((topic) => topic.name === post.category);
    if (found) {
      found.count += 1;
    } else {
      acc.push({ name: post.category, count: 1 });
    }
    return acc;
  }, []);

  const handlePost = (id) => {
    const post = posts?.find((post) => post?._id === id);
    const postSlug = post ? slugify(post?.title, { lower: true }) : "untitled";
    return postSlug;
  };

  return (
    <>
      <div className="flex flex-col border-[1px] rounded-lg pt-4 w-[300px] h-fit min-h-[300px]">
        <div className="bg-white mb-6">
          <div className=" flex flex-row justify-center items-center h-fit">
            <h2 className="text-lg font-[800] text-[#203656] text-center mb-2  ">
              Explore Topics
            </h2>
          </div>
          <div className="flex justify-center pb-4 px-2">
            <LinearSvg />
          </div>
          <div className="p-6">
            <ul className="block w-full h-fit min-h-[200px] pb-1">
              {topics.map((topic, index) => (
                <li
                  key={index}
                  className="flex w-full justify-between text-gray-700 py-3 relative before:content-[''] before:block before:h-[1px] before:w-full before:absolute before:bottom-0 before:left-0 before:bg-gradient-to-r before:from-[#bebebe] before:to-transparent"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-[#fe4f70]">
                      <FontAwesomeIcon icon={faAngleRight} size="xs" />
                    </span>
                    <Link
                      href={{
                        pathname: `/blog/category/${topic?.name}`,
                      }}
                    >
                      <span className="font-semibold text-sm hover:text-[#fe4f70] cursor-pointer">
                        {topic.name}
                      </span>
                    </Link>
                  </span>
                  <span className="text-gray-400 text-sm">({topic.count})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreTopics;
