import { Fragment, useState } from "react";
import {
  connectDatabase,
  getAllPosts,
  getPostsByUser,
} from "../../../lib/api-util";
import { formatDate } from "../../../lib/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Spinner from "../../../components/ui/spinner";
import ErrorModal from "../../../components/ui/modal/error-modal";
import SuccessModal from "../../../components/ui/modal/success-modal";
import { useRouter } from "next/router";
import { jwtVerify } from "jose";

function PostList(props) {
  const { posts } = props;
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [loadingStatus, setLoadingStatus] = useState({});
  const [message, setMessage] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleAddButton = (tab) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleSubmit = async (id) => {
    setLoadingStatus((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (data?.success) {
        router.push("/admin/panel/post-list");
        setMessage({ message: "Post deleted successfully.", success: true });
      } else {
        setMessage({
          message: "Failed to delete post. Please try again.",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage({
        message: "An error occurred. Please try again later.",
        success: false,
      });
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (id) => {
    setIsEditLoading((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setIsEditLoading((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Fragment>
      <div className="container mx-auto p-4">
        <nav className="flex flex-row justify-between pt-2 pb-4">
          <Link href="/admin" className="hover:text-pink-500">
            <FontAwesomeIcon icon={faArrowLeft} /> Go Back
          </Link>
          <span className="text-black-500 font-bold text-xl">All Posts</span>
          <span></span>
        </nav>
        <div className="flex justify-between mb-4 items-center">
          <input
            type="text"
            placeholder="Search Post"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg placeholder-gray-400"
          />
          <Link href="/admin/panel/add-post">
            <button
              onClick={handleAddButton}
              className="w-32 flex flex-row justify-center px-4 py-2 bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387] text-white rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              {isLoading ? <Spinner /> : <span>+ Add Post</span>}
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg border-[1px]">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="p-4 text-left">Author Name</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 && filteredPosts ? (
                filteredPosts?.map((post) => (
                  <>
                    <tr key={post._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{post?.name || "John"}</td>
                      <td className="p-4 hover:text-[#fe4f70]">{post.title}</td>
                      <td className="p-4">{post.category}</td>
                      <td className="p-4">{post.date}</td>
                      <td className="p-4 flex space-x-6">
                        <button
                          className="flex flex-row justify-center items-center w-8 text-blue-500"
                          onClick={() => handleEdit(post._id)}
                        >
                          <Link
                            href={`/admin/panel/edit-post/${encodeURIComponent(
                              post._id
                            )}`}
                            className="hover:text-[#fe4f70]"
                          >
                            {isEditLoading[post?._id] ? (
                              <Spinner />
                            ) : (
                              <FontAwesomeIcon icon={faEdit} />
                            )}
                          </Link>
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600 w-8"
                          onClick={() => handleSubmit(post?._id)}
                        >
                          {loadingStatus[post._id] ? (
                            <Spinner />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} />
                          )}
                        </button>
                      </td>
                    </tr>
                  </>
                ))
              ) : (
                <div className="flex flex-row justify-center items-center p-48 ml-24">
                  <p>No Post Found with this user</p>
                </div>
              )}
            </tbody>
          </table>
        </div>
        {filteredPosts?.length < 6 && <div className="mt-48"></div>}
        <div className="relative">
          {message?.success == false ? (
            <ErrorModal message={message} setMessage={setMessage} />
          ) : (
            <SuccessModal message={message} setMessage={setMessage} />
          )}
        </div>
      </div>
    </Fragment>
  );
}

export async function getServerSideProps({ req }) {
  const token = req?.cookies?.token;

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
    let userPosts = token
      ? await getPostsByUser(client, "posts", { _id: userId })
      : await getAllPosts(client, "posts", { _id: -1 });
    if (token) {
      userPosts = userPosts?.userPosts;
    }
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

export default PostList;
