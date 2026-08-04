import { Router } from "express";

import protect from "@/middleware/protect";
import adminOnly from "@/middleware/adminOnly";

import {
    getAllCommissionsController,
    getCommissionSettingsController,
    updateCommissionSettingsController,
    updateCommissionStatusController,
} from "@/controllers/admin.controller";

const router = Router();

router.patch(
    "/commissions/:id",
    protect,
    adminOnly,
    updateCommissionStatusController
);

router.get(
    "/commissions",
    protect,
    adminOnly,
    getAllCommissionsController
);

router.get(
  "/commission-settings",
  protect,
  adminOnly,
  getCommissionSettingsController
);

router.put(
  "/commission-settings",
  protect,
  adminOnly,
  updateCommissionSettingsController
);

export default router;