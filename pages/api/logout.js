const handler = async (req, res) => {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      `token=; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=0`
    );

    return res
      .status(200)
      .json({ message: "Logout successful", success: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default handler;
