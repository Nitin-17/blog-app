import bcrypt from "bcryptjs";
import { parseDocument, DomUtils } from "htmlparser2";

export async function uploadImage(image) {
  const imageData = await image.arrayBuffer();
  const mime = image.type;
  const encoding = "base64";
  const base64Data = Buffer.from(imageData).toString("base64");

  const fileData = {
    mime, // MIME type of the image
    encoding, // Encoding type (base64)
    data: base64Data, // Base64-encoded image data
    uploadedAt: new Date(),
  };

  return fileData;
}

export const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  if (!date || isNaN(new Date(date).getTime())) {
    return "Invalid Date";
  }
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(date);
};

/* Extract First <p> tag from react quill */
export const extractFirstPText = (htmlString) => {
  const dom = parseDocument(htmlString);
  const firstPTag = DomUtils.findOne((elem) => elem.name === "p", dom.children);
  return firstPTag
    ? DomUtils.textContent(firstPTag).slice(0, 200)
    : "No <p> tag found";
};

/* Formatting date for slug */
export const formatDateSlug = (dateString) => {
  const date = new Date(dateString); // Convert string to Date object
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() is 0-based
  const day = date.getDate();
  return `${year}/${month}/${day}`;
};

export const encryptPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error encrypting password:", error);
    throw new Error("Encryption failed");
  }
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Verification failed");
  }
};

export const generateOTP = () => {
  var digits = "0123456789";

  var otpLength = 6;

  var otp = "";

  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);

    otp = otp + digits[index];
  }

  return otp;
};
