import {
  getAffiliateDetailsController,
  getAllAffiliatesController,
  getPlatformStatsController,
  getTopAffiliatesController,
} from "@/controllers/affiliate.controller";

import express from "express";

import protect from "@/middleware/protect";
import adminOnly from "@/middleware/adminOnly";

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  getAllAffiliatesController
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getAffiliateDetailsController
);

router.get(
  "/top-affiliates",
  protect,
  adminOnly,
  getTopAffiliatesController
);

router.get(
  "/platform-stats",
  protect,
  adminOnly,
  getPlatformStatsController
);


export default router;