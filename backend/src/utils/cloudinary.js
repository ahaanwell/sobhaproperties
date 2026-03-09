import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath, folder = "projects") => {
  try {
    if (!localFilePath) throw new Error("File path is missing");

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder,
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return null;

    // Extract public_id from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1].split(".")[0];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `${folder}/${fileName}`;

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete failed:", error.message);
    return null;
  }
};
