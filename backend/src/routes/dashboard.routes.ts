import { Router } from "express";

import protect from "@/middleware/protect";

import { getDashboardController } from "@/controllers/dashboard.controller";

const router = Router();

router.get(
  "/",
  protect,
  getDashboardController
);

export default router;