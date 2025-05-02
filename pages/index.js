import { Fragment, useEffect } from "react";
import { connectDatabase, getAllPosts } from "../lib/api-util";
import FeaturedPost from "../components/ui/featured-post/featured-post";
import { formatDate } from "../lib/helpers";
import PopularRecentPosts from "../components/ui/popular-posts/popular-recent-posts";
import TrendingPosts from "../components/ui/trending/trending-posts";
import ExploreTopics from "../components/ui/trending/explore-topics";
import LinearSvg from "../components/ui/linear-svg";
import NewsLetter from "../components/ui/news-letter/news-letter";
import LatestPosts from "../components/ui/latest-posts/latest-posts";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/postsSlice";
import { jwtVerify } from "jose";

function IndexPage({ posts }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (posts?.length > 0) {
      dispatch(setPosts(posts));
    }
  }, [dispatch, posts]);

  const storedPosts = useSelector((state) => state.posts.posts);

  return (
    <Fragment>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="max-w-[68rem] mr-auto py-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FeaturedPost posts={storedPosts} />
            <PopularRecentPosts posts={storedPosts} />
          </div>
        </div>

        {/* Trending Section */}
        <div className="max-w-[68rem] mr-auto py-1 mt-10">
          <h3 className="text-[24px] font-bold mb-2">Trending</h3>
          <LinearSvg />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <TrendingPosts posts={storedPosts} />
            <div className="flex flex-col gap-6">
              <ExploreTopics posts={storedPosts} />
              <NewsLetter />
            </div>
          </div>
        </div>

        {/* Latest Posts Section */}
        <div className="max-w-[50rem] mr-auto py-1 mt-10">
          <h3 className="text-[24px] font-bold mb-2">Latest</h3>
          <LinearSvg />
          <div className="grid grid-cols-2 md:grid-cols-1 gap-6 mt-6">
            <LatestPosts posts={storedPosts} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export async function getServerSideProps({ req }) {
  // Extract token from cookies
  const token = req?.cookies?.token;

  /*   if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } */

  let userId;
  if (token) {
    try {
      const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, SECRET_KEY);
      userId = payload.userId;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  let client;
  try {
    client = await connectDatabase("admin");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    return { props: { posts: [] } };
  }

  try {
    /* let userPosts = token
      ? await getPostsByUser(client, "posts", { _id: userId })
      : await getAllPosts(client, "posts", { _id: -1 }); */
    let userPosts = await getAllPosts(client, "posts", { _id: -1 });
    /* if (token) {
      userPosts = userPosts?.userPosts;
    } */
    return {
      props: {
        posts: userPosts?.map((post) => ({
          _id: post._id.toString(),
          content: post.content || "",
          title: post.title || "No Title",
          category: post.category || "Random",
          image: post.image
            ? {
                mime: post.image.mime || null,
                encoding: post.image.encoding || null,
                data: post.image.data || null,
              }
            : null,
          date: formatDate(post.date),
        })),
      },
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    client.close();
    return { props: { posts: [] } };
  }
}

export default IndexPage;
