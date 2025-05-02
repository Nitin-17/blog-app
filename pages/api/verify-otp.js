import Redis from "redis";

import { connectRedis } from "../../lib/redis-util";

// Initialize Redis
const client = await connectRedis();

export default async function handler(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Retrieve OTP from Redis
    const storedOtp = await client.get(email);

    if (!storedOtp) {
      return res
        .status(400)
        .json({ message: "OTP expired or not found", success: false });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    // OTP is valid; proceed with registration or action
    await client.del(email); // Remove OTP after successful verification

    return res
      .status(200)
      .json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ message: "Error verifying OTP", success: false });
  }
}
