import {
  connectDatabase,
  getCommentsById,
  postComment,
} from "../../lib/api-util";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { postId } = req.body;
    console.log("req.body", req.body);

    if (!postId) {
      return res.status(400).json({ error: "No Post Id found" });
    }

    try {
      let client;

      try {
        client = await connectDatabase("admin");
      } catch (error) {
        res.status(500).json({ message: "Connecting to Database failed" });
        return;
      }

      try {
        const result = await getCommentsById(client, "post-comments", {
          _id: postId.trim(),
        });
        client.close();

        console.log("result", result);

        if (result.message === "Post doesn't exist") {
          res.status(200).json({
            message: "Post doesn't exist",
            id: result.postId,
            success: false,
          });
        } else {
          res.status(201).json({
            message: "Post Comment Fetched successfully",
            comments: result.comments,
            success: true,
          });
        }
      } catch (error) {
        console.error("Error fetching post comments:", error);
        res
          .status(500)
          .json({ message: "Fetching post comment failed", success: false });
      }

      return res.status(200).json(result?.comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
