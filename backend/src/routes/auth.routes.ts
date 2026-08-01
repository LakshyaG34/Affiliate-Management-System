import { Router } from "express";
import { getCurrentUser, login, logout, register } from "@/controllers/auth.controller";
import protect from "@/middleware/protect";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);

export default router;