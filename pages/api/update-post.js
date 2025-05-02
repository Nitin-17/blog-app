import { connectDatabase, updatePost } from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { content, title, category, image, id } = req.body;

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
      await updatePost(client, {
        _id: id,
        content: content,
        title: title,
        category: category,
        image: image
          ? {
              mime: image.mime || null,
              encoding: image.encoding || null,
              data: image.data || null,
            }
          : null,
        date: new Date(),
      });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Updating Post failed" });
    }

    res.status(201).json({ message: "Post Updated" });
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
