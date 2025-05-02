import { connectDatabase, postComment } from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, name, comment, website, postId } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!comment) {
      return res.status(400).json({ error: "Comment is required" });
    }
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    let client;

    try {
      client = await connectDatabase("admin");
    } catch (error) {
      res.status(500).json({ message: "Connecting to Database failed" });
      return;
    }

    try {
      const result = await postComment(client, "post-comments", {
        name: name.trim(),
        email: email.trim(),
        comment: comment,
        postId: postId,
        date: new Date(),
      });
      client.close();

      if (result.message === "Comment failed") {
        res.status(200).json({
          message: "Not able to add comment on post",
          success: false,
        });
      } else {
        res.status(201).json({
          message: "Comment added successfully",
          commentId: result?.commentId,
          success: true,
        });
      }
    } catch (error) {
      console.error("Error commenting on post", error);
      res.status(500).json({ message: "Post Comment Failed", success: false });
    }

    res.status(201).json({ message: "Comment Added", success: false });
  }
};

export default handler;
