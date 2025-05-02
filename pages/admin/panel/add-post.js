import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Dropdown from "../../../components/ui/dropdown";
import { uploadImage } from "../../../lib/helpers";
import { connectDatabase, getAllCategories } from "../../../lib/api-util";
import Spinner from "../../../components/ui/spinner";
import ErrorModal from "../../../components/ui/modal/error-modal";
import SuccessModal from "../../../components/ui/modal/success-modal";
import { jwtVerify } from "jose"; // Import JWT verification library

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

const PostEditor = ({ categories, userId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]?.value || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload the image and get its storage path
      const uploadedFilePath = await uploadImage(selectedFile);

      const response = await fetch("/api/add-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          image: uploadedFilePath,
          userId,
        }),
      });

      const data = await response.json();

      if (data?.success) {
        setMessage(data);
        setTitle("");
        setContent("");
        setCategory(categories[0]?.value || "");
        setSelectedFile(null);
        setImagePreview(null);
        setStatus(false);
      } else {
        setMessage({
          message: "Failed to save post. Please try again.",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      setMessage({
        message: "An error occurred. Please try again later.",
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-wrap gap-4 p-6">
      <nav className="flex flex-row justify-between pt-2 pb-4">
        <Link href="/admin" className="hover:text-pink-500">
          <FontAwesomeIcon icon={faArrowLeft} /> Go Back
        </Link>
        <span className="text-black-500 font-bold text-xl">Create Post</span>
      </nav>

      <div className="grid gap-6 mb-2 md:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Post Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </div>
      </div>

      <Dropdown options={categories} handleCategory={setCategory} />

      <div className="flex flex-col">
        <label
          htmlFor="image"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Image Preview
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          id="image"
          onChange={handleFileChange}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-4 h-32 w-32 object-cover"
          />
        )}
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
          className="w-28 mb-4 text-white bg-gradient-to-b from-[#ffa387] via-[#fe4f70] to-[#ffa387] p-3 rounded-full flex items-center justify-center"
        >
          {isSubmitting ? <Spinner /> : <span>Save Post</span>}
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

export async function getServerSideProps({ req }) {
  const token = req?.cookies?.token;
  let userId = null;

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

  let categories = [];
  try {
    const client = await connectDatabase("admin");
    const allCategories = await getAllCategories(client, "categories", {
      _id: -1,
    });
    categories = allCategories.map((category) => ({
      id: category._id.toString(),
      value: category.category,
    }));
    client.close();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return {
    props: {
      categories:
        categories.length > 0
          ? categories
          : [{ id: "default", value: "General" }],
      userId,
    },
  };
}

export default PostEditor;
