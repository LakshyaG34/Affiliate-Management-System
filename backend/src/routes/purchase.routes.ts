import { Router } from "express";

import protect from "@/middleware/protect";
import { createPurchaseController } from "@/controllers/purchase.controller";

const router = Router();

router.post("/", protect, createPurchaseController);

export default router;