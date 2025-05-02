import { connectDatabase, insertCategory } from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { category } = req.body;

    if (!category) {
      return res
        .status(400)
        .json({ message: "Category is required", success: false });
    }

    let client;

    try {
      client = await connectDatabase("admin");
    } catch (error) {
      res.status(500).json({ message: "Connecting to Database failed" });
      return;
    }

    try {
      const result = await insertCategory(client, "categories", { category });
      client.close();

      if (result.message === "Category already exists") {
        res.status(200).json({
          message: "Category already exists",
          success: false,
          /* category: result.category, */
        });
      } else {
        res.status(201).json({
          message: "Category added successfully",
          categoryId: result.categoryId,
          success: true,
        });
      }
    } catch (error) {
      console.error("Error inserting category:", error);
      res
        .status(500)
        .json({ message: "Inserting category failed", success: false });
    }

    res.status(201).json({ message: "category Added", success: true });
  }
};

export default handler;
