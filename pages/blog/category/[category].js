import { useRouter } from "next/router";
import PageHeader from "../../../components/page-header/page-header";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faShare, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { extractFirstPText, formatDateSlug } from "../../../lib/helpers";
import ExploreTopics from "../../../components/ui/trending/explore-topics";
import PopularPosts from "../../../components/ui/popular-posts/popular-posts";
import { useState } from "react";
import slugify from "slugify";
import Link from "next/link";

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
  const storedPosts = useSelector((state) => state?.posts?.posts);
  const [visibleSocialIcons, setVisibleSocialIcons] = useState({});

  const categoryPosts = storedPosts?.filter(
    (post) => post?.category?.toLowerCase() === category.toLowerCase()
  );

  const toggleSocialIcons = (key) => {
    setVisibleSocialIcons((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handlePost = (id) => {
    const post = categoryPosts?.find((post) => post?._id === id);
    const postSlug = post ? slugify(post?.title, { lower: true }) : "untitled";
    return postSlug;
  };

  return (
    <div className="pt-10">
      <PageHeader />
      <div className="col-span-1 w-full rounded-lg py-6 bg-white">
        <div className="flex flex-row gap-6 mb-8">
          <div className="col-span-1 w-full border-[1px] rounded-lg bg-white">
            <div className="flex flex-col gap-6 pl-8 pr-6">
              {categoryPosts?.length > 0 &&
                categoryPosts.map((article, index) => {
                  const key = article.id || `article-${index}`;
                  return (
                    <>
                      <div
                        className="flex flex-row items-start gap-4 pt-6 rounded-lg"
                        key={key}
                      >
                        <div className="relative w-64 h-48 flex-shrink-0">
                          <Image
                            src={
                              article?.image
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
                            {article?.category}
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
                            <span>{article.author || "Unknown Author"}</span>
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
                              {extractFirstPText(
                                JSON.stringify(article?.content)
                              ) ||
                                "Description not available for this article."}
                            </p>
                          </div>
                          <div className="mt-4">
                            {!visibleSocialIcons[key] ? (
                              <span
                                className="font-medium cursor-pointer"
                                onClick={() => toggleSocialIcons(key)}
                              >
                                <FontAwesomeIcon
                                  icon={faShare}
                                  size="md"
                                  className="text-gray-500"
                                />
                              </span>
                            ) : (
                              <div className="flex flex-row gap-4 items-center">
                                <span
                                  className="font-medium cursor-pointer"
                                  onClick={() => toggleSocialIcons(key)}
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
                                    <FontAwesomeIcon
                                      icon={faFacebook}
                                      size="sm"
                                    />
                                  </a>
                                  <a
                                    href="#"
                                    className="text-[#8f9bad] hover:text-[#fe4f70]"
                                  >
                                    <FontAwesomeIcon
                                      icon={faInstagram}
                                      size="sm"
                                    />
                                  </a>
                                  <a
                                    href="#"
                                    className="text-[#8f9bad] hover:text-[#fe4f70]"
                                  >
                                    <FontAwesomeIcon
                                      icon={faPinterest}
                                      size="sm"
                                    />
                                  </a>
                                  <a
                                    href="#"
                                    className="text-[#8f9bad] hover:text-[#fe4f70]"
                                  >
                                    <FontAwesomeIcon
                                      icon={faYoutube}
                                      size="sm"
                                    />
                                  </a>
                                  <a
                                    href="#"
                                    className="text-[#8f9bad] hover:text-[#fe4f70]"
                                  >
                                    <FontAwesomeIcon
                                      icon={faTwitter}
                                      size="sm"
                                    />
                                  </a>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <span
                        className="flex w-full justify-between text-gray-700 
                      relative before:content-[''] before:block before:h-[0.5px]
                      before:w-full before:absolute  before:left-0
                      before:bg-gradient-to-r before:from-[#bebebe]
                      before:to-transparent"
                      ></span>
                    </>
                  );
                })}
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <ExploreTopics posts={storedPosts} />
            <PopularPosts posts={storedPosts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
