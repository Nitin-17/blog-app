import { createClient } from "redis";

export const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not defined in the environment variables.");
    }

    console.log("Connecting to Redis at:", process.env.REDIS_URL);

    const redisClient = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      //url: process.env.REDIS_URL, // Redis connection URL
      socket: {
        host: "redis-12153.c212.ap-south-1-1.ec2.redns.redis-cloud.com",
        port: 12153,
      },
    });

    redisClient.on("error", (err) => console.error("Redis Error:", err));

    // Connect to Redis
    await redisClient.connect();

    console.log("Connected to Redis successfully!");

    return redisClient;
  } catch (error) {
    console.error("Failed to connect to Redis:", error.message);
    throw error; // Rethrow error for the calling function to handle
  }
};
