import nodemailer from "nodemailer";
import { connectRedis } from "../../lib/redis-util";
import { generateOTP } from "../../lib/helpers";

// Initialize Redis
const client = await connectRedis();

console.log("client", client);

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Correct Gmail SMTP server
  port: 465, // Use port 587 for TLS
  secure: true, // Use `false` for TLS (recommended); `true` for SSL (port 465)
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

export default async function handler(req, res) {
  const { email } = req.body;

  console.log("email is ", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Store OTP in Redis for 5 minutes
    await client.set(email, otp, { EX: 300 });

    // Send OTP to user's email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return res
      .status(200)
      .json({ message: "OTP sent to email", success: true, email: email });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res
      .status(500)
      .json({ message: "Error generating OTP", success: false });
  }
}
