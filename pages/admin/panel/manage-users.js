import { Fragment, useState } from "react";
import { connectDatabase, getAllUsers } from "../../../lib/api-util";
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

function ManageUsers(props) {
  const { users } = props;
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [loadingStatus, setLoadingStatus] = useState({});
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [message, setMessage] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState({});
  const [isDeleteLoading, setIsDeleteLoading] = useState({});

  const handleEditSpinner = (id) => {
    setIsEditLoading((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setIsEditLoading((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const handleDeleteSpinner = (id) => {
    setIsDeleteLoading((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setIsDeleteLoading((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const handleSubmit = async (id, role) => {
    handleEditSpinner(id);
    setLoadingStatus((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await fetch("/api/manage-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role }),
      });
      const data = await response.json();

      if (data?.success) {
        router.push("/admin/panel/manage-users");
        setMessage({ message: "User updated successfully.", success: true });
      } else {
        setMessage({
          message: "Failed to update user. Please try again.",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage({
        message: "An error occurred. Please try again later.",
        success: false,
      });
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    handleDeleteSpinner(id);
    setDeleteStatus((prev) => ({ ...prev, [id]: true }));
    setMessage(null);

    try {
      const response = await fetch("/api/manage-users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (data?.success) {
        router.push("/admin/panel/manage-users");
        setMessage({ message: "User Deleted successfully.", success: true });
      } else {
        setMessage({
          message: "Failed to delete user. Please try again.",
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
      setDeleteStatus((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Fragment>
      <div className="container mx-auto p-4">
        <nav className="flex flex-row justify-between pt-2 pb-4">
          <Link href="/admin" className="hover:text-pink-500">
            <FontAwesomeIcon icon={faArrowLeft} /> Go Back
          </Link>
          <span className="text-black-500 font-bold text-xl">All Users</span>
          <span></span>
        </nav>
        <div className="flex justify-between mb-4 items-center">
          <input
            type="text"
            placeholder="Search User"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg placeholder-gray-400"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-lg border-[1px]">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Modify User</th>
                <th className="p-4 text-left">Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 && filteredUsers ? (
                filteredUsers?.map((user) => (
                  <>
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{user?.name || "John"}</td>
                      <td className="p-4 hover:text-[#fe4f70]">
                        {user?.email}
                      </td>
                      <td className="p-4">{user?.role}</td>
                      <td className="p-4 flex space-x-6">
                        <button
                          className="text-red-500 hover:text-red-600 w-8"
                          onClick={() => handleSubmit(user?._id, user?.role)}
                        >
                          {isEditLoading[user?._id] ? (
                            <Spinner />
                          ) : (
                            <FontAwesomeIcon icon={faEdit} />
                          )}
                        </button>
                      </td>
                      <td>
                        <button
                          className="text-red-500 hover:text-red-600 w-8"
                          onClick={() => handleDelete(user?._id)}
                        >
                          {isDeleteLoading[user?._id] ? (
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
                  <p>No other Users Found</p>
                </div>
              )}
            </tbody>
          </table>
        </div>
        {filteredUsers?.length < 6 && <div className="mt-36"></div>}
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
    return { props: { users: [] } };
  }

  try {
    let users = token && (await getAllUsers(client, "users", { _id: -1 }));
    return {
      props: {
        users: users?.map((user) => ({
          _id: user._id.toString(),
          name: user.name || "",
          email: user.email || "No Email",
          role: user.role || "Random",
        })),
      },
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    client.close();
    return { props: { users: [] } };
  }
}

export default ManageUsers;
