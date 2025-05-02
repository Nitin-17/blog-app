import { connectDatabase, registerUser } from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, name, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    let client;

    try {
      client = await connectDatabase("admin");
    } catch (error) {
      res.status(500).json({ message: "Connecting to Database failed" });
      return;
    }

    try {
      const result = await registerUser(client, "users", {
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: "user",
      });
      client.close();

      if (result.message === "User already exists") {
        res.status(200).json({
          message: "User already exists",
          userID: result.userId,
          success: false,
        });
      } else {
        res.status(201).json({
          message: "User registered successfully",
          userId: result.userId,
          success: true,
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res
        .status(500)
        .json({ message: "Registering user failed", success: false });
    }

    res.status(201).json({ message: "User Added", success: false });
  }
};

export default handler;
