import cloudinary from "cloudinary";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Image file required" });
  }

  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("CLOUDINARY_CLOUD_NAME not configured - image upload will fail in production");
    return res.status(503).json({ 
      message: "Image upload service is not configured. Contact administrator.",
      details: "Cloudinary credentials missing"
    });
  }

  const imageUrl = await new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream({ folder: "civic-voice" }, (error, output) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(output.secure_url);
    });

    stream.end(req.file.buffer);
  });

  return res.json({ imageUrl });
}
