import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Dropdown from "../../../../components/ui/dropdown";
import { uploadImage } from "../../../../lib/helpers";
import {
  connectDatabase,
  getAllCategories,
  getAllPosts,
  getPostById,
} from "../../../../lib/api-util";
import { useRouter } from "next/router";
import Image from "next/image";
import ErrorModal from "../../../../components/ui/modal/error-modal";
import SuccessModal from "../../../../components/ui/modal/success-modal";
import Spinner from "../../../../components/ui/spinner";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  },
};

const options = [
  {
    id: "lifestyle",
    value: "lifestyle",
  },
  {
    id: "entertainment",
    value: "entertainment",
  },
];

const EditPost = (props) => {
  const { post, categories } = props;
  const router = useRouter();

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post.content || "");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Set initial data for editing
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);

    if (post.image?.data && post.image?.mime) {
      setImagePreview(
        `data:${post.image.mime};${post.image.encoding},${post.image.data}`
      );
    }
  }, [post]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategory = (category) => {
    setCategory(category);
  };

  const handleSubmit = async () => {
    const imageToUpload = selectedFile || post.image;
    if (!imageToUpload) {
      alert("Please select a file or keep the existing image.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedFilePath = null;

      if (selectedFile) {
        // Upload new file only if selected
        uploadedFilePath = await uploadImage(selectedFile);
      } else {
        // Keep the current image if no file is selected
        uploadedFilePath = post?.image;
      }
      setStatus(true);
      const response = await fetch("/api/update-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: post?._id,
          title,
          content,
          category,
          image: uploadedFilePath,
        }),
      });

      if (response.ok) {
        //alert("Post updated successfully!");
        setMessage({ message: "Post updated successfully!", success: true });
        setStatus(false);
        router.push("/admin/panel/post-list");
      } else {
        //alert("Failed to update post. Please try again.");
        setStatus(false);

        setMessage({ message: "Can't update the post!", success: false });
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred. Please try again later.");
      setStatus(false);
    } finally {
      setIsSubmitting(false);
      setStatus(false);
    }
  };

  return (
    <div className="flex flex-col flex-wrap gap-4 p-6">
      <nav className="flex flex-row justify-between pt-2 pb-4">
        <Link href="/admin/panel/post-list" className="hover:text-pink-500">
          <FontAwesomeIcon icon={faArrowLeft} /> Go Back
        </Link>
        <span className="text-black-500 font-bold text-xl">Edit Post</span>
        <span></span>
      </nav>
      <div className="grid gap-6 mb-2 md:grid-cols-2">
        <div>
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Title
          </label>
          <input
            type="text"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Title"
            onChange={(event) => setTitle(event.target.value)}
            required
            value={title}
          />
        </div>
      </div>
      <Dropdown
        options={categories}
        handleCategory={handleCategory}
        selectedCategory={post.category}
      />
      <div className="flex flex-col">
        <label
          htmlFor="image"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Image Preview
        </label>
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            className="mb-4 h-48 w-48 object-cover"
            width={100}
            height={100}
          />
        ) : (
          <Image
            src="/images/fallback-image.jpg"
            alt="No Preview"
            className="mb-4 h-48 w-48 object-cover"
            width={100}
            height={100}
          />
        )}

        <input
          type="file"
          accept="image/png, image/jpeg"
          id="image"
          name="image"
          onChange={handleFileChange}
        />
      </div>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        className="h-72 mb-10"
      />
      <div className="flex flex-row justify-center">
        <button
          onClick={handleSubmit}
          className="w-36 mb-4 hover:bg-gradient-to-b hover:from-[#fe4f70] hover:via-[#ffa387] hover:to-[#fe4f70] text-white bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387] p-3 rounded-full flex items-center justify-center"
        >
          {status ? <Spinner /> : <span>Update Post</span>}
        </button>
      </div>
      <div className="relative">
        {message?.success === false ? (
          <ErrorModal message={message} setMessage={setMessage} />
        ) : (
          <SuccessModal message={message} setMessage={setMessage} />
        )}
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  let client;
  try {
    client = await connectDatabase("admin");
  } catch (error) {
    console.error("Failed to connect to database");
    return { paths: [], fallback: false };
  }

  try {
    const allPosts = await getAllPosts(client, "posts", {
      _id: -1,
    });

    const paths = allPosts.map((post) => ({
      params: { id: post._id.toString() },
    }));

    client.close();

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    client.close();

    return { paths: [], fallback: false };
  }
}

export async function getStaticProps(id) {
  let client;
  try {
    client = await connectDatabase("admin");

    const post = await getPostById(client, id?.params);

    if (!post) {
      return {
        props: {
          post: {},
          categories: options,
        },
        revalidate: 30,
      };
    }

    const allCategories = await getAllCategories(client, "categories", {
      _id: -1,
    });

    return {
      props: {
        post: {
          _id: post._id.toString(),
          title: post.title,
          content: post.content,
          category: post.category,
          image: post.image
            ? {
                mime: post.image.mime || null,
                encoding: post.image.encoding || null,
                data: post.image.data || null,
              }
            : null,
        },
        categories: allCategories.map((category) => ({
          id: category._id.toString(),
          value: category.category,
        })),
      },
      revalidate: 30,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);

    return {
      props: {
        post: {},
        categories: options,
      },
      revalidate: 30,
    };
  } finally {
    client?.close();
  }
}

export default EditPost;
