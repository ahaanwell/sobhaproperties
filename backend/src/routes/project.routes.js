import express from "express";
import {
  addProject,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  deleteGalleryImage,
  getDashboardStats,
} from "../controllers/project.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { projectUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProjects);
router.get("/slug/:slug", getProjectBySlug);

// Protected routes
router.get("/stats", protect, getDashboardStats);
router.get("/id/:id", protect, getProjectById);
router.post("/", protect, projectUpload, addProject);
router.put("/:id", protect, projectUpload, updateProject);
router.delete("/:id", protect, deleteProject);
router.patch("/:id/toggle-status", protect, toggleProjectStatus);
router.delete("/:id/gallery", protect, deleteGalleryImage);

export default router;
