import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure temp directory exists
const tempDir = "public/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Keep original name cleaned up + timestamp to avoid conflicts
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .substring(0, 50);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG, and WEBP files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

export const projectUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "gallery", maxCount: 15 },
  { name: "floorPlanImages", maxCount: 20 },
  { name: "masterPlanImage", maxCount: 1 },
]);

export const blogUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
]);

export const singleUpload = upload.single("image");