import {
  connectDatabase,
  loginUser,
  findUserByEmail,
  loginUserWithEmail,
} from "../../lib/api-util";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, otpLogin, isUserVerified } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  let client;

  try {
    client = await connectDatabase("admin");
  } catch (error) {
    return res.status(500).json({ message: "Connecting to Database failed" });
  }

  try {
    if (otpLogin) {
      // OTP Login Flow: Check if user exists and send OTP
      const user = await findUserByEmail(client, "users", {
        email: email.trim(),
      });

      if (!user) {
        client.close();
        return res.status(200).json({
          message: "User not found. Please sign up first.",
          success: false,
        });
      }

      if (user) {
        return res.status(200).json({
          message: "user found",
          success: true,
        });
      } else {
        return res.status(500).json({
          message: "Failed to find User. Please try again.",
          success: false,
        });
      }
    } else if (isUserVerified) {
      /* OTP Login */

      if (!email) {
        client.close();
        return res.status(400).json({ error: "Email is required" });
      }

      const result = await loginUserWithEmail(client, "users", {
        email: email.trim(),
      });

      res.setHeader(
        "Set-Cookie",
        `token=${result?.token}; HttpOnly; Path=/; Secure; SameSite=Strict`
      );

      return res.status(201).json({
        message: "User Login Successful",
        success: true,
        token: result?.token,
        userId: result?.userId,
        email: result?.email,
        name: result?.name,
      });
    } else {
      // Login with Email and Password Flow

      if (!password) {
        client.close();
        return res.status(400).json({ error: "Password is required" });
      }

      const result = await loginUser(client, "users", {
        email: email.trim(),
        password: password.trim(),
      });

      client.close();

      if (result.message === "User not found") {
        return res.status(200).json({
          message: "User not found",
          success: false,
        });
      }

      res.setHeader(
        "Set-Cookie",
        `token=${result?.token}; HttpOnly; Path=/; Secure; SameSite=Strict`
      );

      return res.status(201).json({
        message: "User Login Successful",
        success: true,
        token: result?.token,
        userId: result?.userId,
        email: result?.email,
        name: result?.name,
      });
    }
  } catch (error) {
    client.close();
    console.error("Error handling request:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export default handler;
