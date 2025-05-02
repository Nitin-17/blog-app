import { connectDatabase, insertPost } from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { content, title, category, image, userId } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    let client;

    try {
      client = await connectDatabase("admin");
    } catch (error) {
      res.status(500).json({ message: "Connecting to Database failed" });
      return;
    }

    try {
      await insertPost(client, "posts", {
        content: content,
        title: title,
        category: category,
        image: image,
        date: new Date(),
        userId: userId,
      });
      client.close();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Inserting data failed", success: false });
    }

    res.status(201).json({ message: "Post Added", success: true });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default handler;
