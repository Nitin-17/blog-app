import { connectDatabase, subscribeUser } from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let client;

    try {
      client = await connectDatabase("admin");
    } catch (error) {
      res.status(500).json({ message: "Connecting to Database failed" });
      return;
    }

    try {
      const result = await subscribeUser(client, "subscribers", {
        email: email?.trim(),
      });
      client.close();

      console.log("resultttt", result);

      if (result.message === "Already subscribed") {
        res.status(200).json({
          message: "Already subscribed",
          email: result.email,
          success: false,
        });
      } else {
        res.status(201).json({
          message: "User subscription added successfully",
          email: result.email,
          success: true,
        });
      }
    } catch (error) {
      console.error("Error subscribing user:", error);
      res
        .status(500)
        .json({ message: "Subscrbing user failed", success: false });
    }

    res.status(201).json({ message: "Subscription Added", success: false });
  }
};

export default handler;
