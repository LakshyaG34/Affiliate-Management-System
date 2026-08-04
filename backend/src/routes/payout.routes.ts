import { Router } from "express";

import protect from "@/middleware/protect";
import adminOnly from "@/middleware/adminOnly";

import {
  requestPayoutController,
  getMyPayoutsController,
  getAllPayoutsController,
  updatePayoutStatusController,
} from "@/controllers/payout.controller";

const router = Router();

router.post(
  "/request",
  protect,
  requestPayoutController
);

router.get(
  "/my",
  protect,
  getMyPayoutsController
);

router.get(
  "/admin",
  protect,
  adminOnly,
  getAllPayoutsController
);

router.patch(
  "/admin/:id",
  protect,
  adminOnly,
  updatePayoutStatusController
);

export default router;