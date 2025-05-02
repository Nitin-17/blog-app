import { connectDatabase, deletePost } from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "No Post Id found" });
    }

    let client;

    try {
      client = await connectDatabase("admin");
    } catch (error) {
      res.status(500).json({ message: "Connecting to Database failed" });
      return;
    }

    try {
      const result = await deletePost(client, "posts", {
        postId: id.trim(),
      });
      client.close();

      if (result.message === "Post doesn't exist") {
        res.status(200).json({
          message: "Post doesn't exist",
          postId: result.postId,
          success: false,
        });
      } else {
        res.status(201).json({
          message: "Post Deleted successfully",
          postId: result.postId,
          success: true,
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Deleting post failed", success: false });
    }

    res.status(201).json({ message: "Post Added", success: false });
  }
};

export default handler;
