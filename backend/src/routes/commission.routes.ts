import { Router } from "express";

import protect from "@/middleware/protect";
import { getMyCommissionsController } from "@/controllers/commission.controller";

const router = Router();

router.get(
  "/",
  protect,
  getMyCommissionsController
);

export default router;