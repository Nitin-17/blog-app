import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { verifyPassword } from "./helpers";

export const connectDatabase = async (database) => {
  const client = await MongoClient.connect(
    `${process.env.MONGODB_URL_INITIAL}/${database}${process.env.MONGODB_URL_LATER}`
  );
  console.log("Successfully ");
  return client;
};

export const insertPost = async (client, collection, document) => {
  const db = client.db("posts");
  const result = await db.collection(collection).insertOne(document);
  return result;
};

export const getAllPosts = async (client, collection, sort) => {
  /*  
  const db = await client.db("posts");
 const documents = await db
    .collection("posts")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          title: 1,
          content: 1,
          category: 1,
          createdAt: 1,
          userId: 1,
          image: 1,
          author: `$userInfo.name`,
        },
      },
      { $sort: sort },
    ])
    .toArray(); */
  const documents = await db.collection("posts").find().sort(sort).toArray();
  return documents;
};

export const deleteUser = async (client, id) => {
  if (!id) {
    throw new Error("Id is required to delete user");
  }

  const db = client.db("users");
  const result = await db
    .collection("users")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    throw new Error("No user found with the given id");
  }
};

export const getPostsByUser = async (client, collection, params) => {
  let userPosts;
  try {
    const postDb = client.db("posts");
    console.log("user ID isssss", params);

    userPosts = await postDb
      .collection("posts")
      .find({ userId: params?._id })
      .sort({ _id: -1 })
      .toArray();

    if (userPosts?.length < 0) {
      console.log("No Posts found for with this User:", params._id);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { message: "Failed to fetch posts", success: false, error };
  }

  return {
    message: userPosts?.length
      ? "Posts fetched successfully"
      : "No comments found",
    userPosts,
    success: true,
  };
};

export const getPostById = async (client, params) => {
  const db = client.db("posts");
  const post = await db
    .collection("posts")
    .findOne({ _id: new ObjectId(params?.id) });
  return post;
};

export const getAllCategories = async (client, collection, sort) => {
  const db = client.db("categories");
  const documents = await db.collection(collection).find().sort(sort).toArray();
  return documents;
};

export const getAllUsers = async (client, collection, sort) => {
  const db = client.db("users");
  const users = await db.collection(collection).find().sort(sort).toArray();
  return users;
};

export const updateUser = async (client, params) => {
  if (!params || !params._id) {
    throw new Error("Invalid params or missing _id");
  }

  try {
    const db = client.db("users");
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(params?._id) },
      {
        $set: {
          role: params.role || null,
        },
      },
      {
        returnDocument: "after",
        upsert: false,
      }
    );

    if (!result.value) {
      console.warn(`No user found with ID: ${params._id}`);
      return null;
    }

    console.log("User update successful:", result.value);
    return result.value;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

export const insertCategory = async (client, collection, category) => {
  try {
    const db = client.db("categories");
    const existingCategory = await db.collection(collection).findOne({
      category: { $regex: new RegExp(`^${category.category}$`, "i") },
    });

    if (existingCategory) {
      console.log("Category already exists:", existingCategory);
      return { message: "Category already exists", category: existingCategory };
    }

    const result = await db.collection(collection).insertOne(category);
    console.log("New category added with ID:", result.insertedId);
    return {
      message: "Category added successfully",
      categoryId: result.insertedId,
    };
  } catch (error) {
    console.error("Error processing category:", error);
    throw error;
  }
};

export const updatePost = async (client, document) => {
  if (!document || !document._id) {
    throw new Error("Invalid document or missing _id");
  }

  try {
    const db = client.db("posts");
    const result = await db.collection("posts").findOneAndUpdate(
      { _id: new ObjectId(document._id) },
      {
        $set: {
          title: document.title || null,
          category: document.category || null,
          image: document.image || null,
          content: document.content || null,
          date: new Date(),
        },
      },
      {
        returnDocument: "after",
        upsert: false, // Do not insert if the document does not exist
      }
    );

    if (!result.value) {
      console.warn(`No document found with ID: ${document._id}`);
      return null; // Return null if no matching document was found
    }

    console.log("Update successful:", result.value);
    return result.value; // Return the updated document
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error("Failed to update document");
  }
};

export const registerUser = async (client, collection, params) => {
  try {
    const db = client.db("users");
    const existingUser = await db.collection("users").findOne({
      email: params?.email,
    });

    if (existingUser) {
      return { message: "User already exists", user: existingUser };
    }

    const result = await db.collection(collection).insertOne(params);
    console.log("New User added with ID:", result.insertedId);
    return {
      message: "User added successfully",
      userId: result.insertedId,
    };
  } catch (error) {
    console.error("Error processing User:", error);
    throw error;
  }
};

export const loginUser = async (client, collection, params) => {
  try {
    const db = client.db("users");
    const existingUser = await db.collection("users").findOne({
      email: params?.email,
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const isPasswordValid = await verifyPassword(
      params?.password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser?.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      message: "Login successful",
      token: token,
      userId: existingUser._id,
      email: existingUser.email,
      name: existingUser?.name,
    };
  } catch (error) {
    console.error("Error processing User:", error);
    throw error;
  }
};

export const loginUserWithEmail = async (client, collection, params) => {
  try {
    const db = client.db("users");
    const existingUser = await db.collection("users").findOne({
      email: params?.email,
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: existingUser?._id,
        email: existingUser?.email,
        role: existingUser?.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      message: "Login successful",
      token: token,
      userId: existingUser?._id,
      email: existingUser?.email,
      name: existingUser?.name,
    };
  } catch (error) {
    console.error("Error processing User:", error);
    throw error;
  }
};

export const findUserByEmail = async (client, collection, params) => {
  try {
    const db = client.db("users");
    const existingUser = await db.collection("users").findOne({
      email: params?.email,
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    return {
      message: "User found",
      email: existingUser.email,
    };
  } catch (error) {
    console.error("Error processing User:", error);
    throw error;
  }
};

export const deletePost = async (client, collection, params) => {
  try {
    const db = client.db("posts");
    const postId = new ObjectId(params?.postId);

    const existingPost = await db.collection(collection).findOne({
      _id: postId,
    });

    if (!existingPost) {
      console.log("Post doesn't exist:", existingPost);
      return { message: "Post doesn't exist", postId: null };
    }

    const result = await db.collection(collection).deleteOne({ _id: postId });

    console.log("Post deleted with result:", result);
    return {
      message: "Post Deleted successfully",
      postId: params.postId,
    };
  } catch (error) {
    console.error("Error processing post:", error);
    throw error;
  }
};

/* User Subscription */
export const subscribeUser = async (client, collection, params) => {
  console.log("params", params);
  try {
    const db = client.db("subscribers");
    const existingUser = await db.collection("subscribers").findOne({
      email: params?.email,
    });

    if (existingUser) {
      return { message: "Already subscribed", email: params?.email };
    }

    const result = await db.collection(collection).insertOne(params);
    console.log("User subscription added:", params?.email);
    return {
      message: "User subscription added successfully",
      email: params?.email,
    };
  } catch (error) {
    console.error("Error processing subscription:", error);
    throw error;
  }
};

/* Post Comment API */
export const postComment = async (client, collection, params) => {
  try {
    const db = client.db("post-comments");

    const result = await db.collection(collection).insertOne(params);
    if (!result) {
      return {
        message: "Comment failed",
      };
    }
    return {
      message: "Comment added successfully",
      commentId: result?.insertedId,
    };
  } catch (error) {
    console.error("Error processing comment:", error);
    throw error;
  }
};

export const getCommentsById = async (client, collection, params) => {
  let post;
  try {
    const db = client.db("posts");
    post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(params?._id) });

    if (!post) {
      return {
        message: "Post doesn't exist",
        postId: params?._id,
        success: false,
      };
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return { message: "Failed to fetch post", success: false, error };
  }

  let comments;
  try {
    const commentsDb = client.db("post-comments");

    comments = await commentsDb
      .collection("post-comments")
      .find({ postId: params._id })
      .sort({ _id: -1 })
      .toArray();

    if (!comments.length) {
      console.log("No comments found for post ID:", params._id);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { message: "Failed to fetch comments", success: false, error };
  }

  return {
    message: comments.length
      ? "Comments fetched successfully"
      : "No comments found",
    comments,
    success: true,
  };
};
