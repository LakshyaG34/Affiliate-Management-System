import { Router } from "express";

import protect from "@/middleware/protect";
import adminOnly from "@/middleware/adminOnly";

import {
  updateCommissionStatusController,
} from "@/controllers/admin.controller";

const router = Router();

router.patch(
  "/commissions/:id",
  protect,
  adminOnly,
  updateCommissionStatusController
);

export default router;