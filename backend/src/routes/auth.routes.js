import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getMe,
  changeAdminPassword,
  updateProfile,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/auth.controller.js";
import { protect, superAdminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/me", protect, getMe);
router.put("/change-password", protect, changeAdminPassword);
router.put("/update-profile", protect, updateProfile);

// Super Admin only
router.get("/admins", protect, superAdminOnly, getAllAdmins);
router.delete("/admins/:id", protect, superAdminOnly, deleteAdmin);

export default router;
