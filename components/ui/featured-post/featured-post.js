import Image from "next/image";
import Link from "next/link";
import React from "react";
import slugify from "slugify";
import { formatDateSlug } from "../../../lib/helpers";

const FeaturedPost = ({ posts = [] }) => {
  if (!posts.length) return null; // Early return for empty posts array

  const post = posts[0];
  const slug = post?.title ? slugify(post.title, { lower: true }) : "untitled";
  const imageSrc = post?.image
    ? `data:${post.image.mime};${post.image.encoding},${post.image.data}`
    : "/images/no-preview";
  const postDate = post?.date || "Unknown date";
  const postCategory = post?.category || "Uncategorized";
  const postTitle = post?.title || "Untitled";

  return (
    <div className="md:col-span-3 z-[1]">
      <div className="relative w-full h-auto bg-gray-200 rounded-lg overflow-hidden group cursor-pointer">
        {/* Image with hover effect */}
        <Link href={`/posts/${slug}`}>
          <Image
            src={imageSrc}
            alt={postTitle}
            width={850}
            height={600}
            className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Text content */}
        <div className="absolute bottom-4 left-4 text-white space-y-2">
          <span className="px-2 py-1 text-sm bg-pink-500 rounded-md">
            {postCategory}
          </span>
          <h2 className="text-3xl font-bold hover:text-[#f0758b]">
            <Link
              href={{
                pathname: `/blog/posts/${formatDateSlug(post.date)}/${slug}`,
              }}
            >
              {postTitle}
            </Link>
          </h2>
          <p className="text-sm">Katen Doe • {postDate}</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
