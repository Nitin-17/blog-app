import { connectDatabase } from "../../lib/api-util";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let client;

      try {
        client = await connectDatabase("admin");
      } catch (error) {
        res.status(500).json({ message: "Connecting to Database failed" });
        return;
      }

      const db = client.db("posts");
      const posts = await db.collection("posts").find().toArray();

      return res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
