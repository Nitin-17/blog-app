import { connectDatabase, updateUser, deleteUser } from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { role, id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }
    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    let client;

    try {
      client = await connectDatabase("admin");
    } catch (error) {
      return res.status(500).json({ message: "Connecting to Database failed" });
    }

    try {
      await updateUser(client, {
        _id: id,
        role: role === "admin" ? "user" : "admin",
      });
      client.close();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Updating User failed", success: false });
    }

    res.status(201).json({ message: "User Updated", success: true });
  } else if (req.method === "DELETE") {
  /* FOR DELETING THE USER */
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    let client;

    try {
      client = await connectDatabase("admin");
    } catch (error) {
      return res.status(500).json({ message: "Connecting to Database failed" });
    }

    try {
      await deleteUser(client, id);
      client.close();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Deleting User failed", success: false });
    }

    res.status(200).json({ message: "User Deleted", success: true });
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
