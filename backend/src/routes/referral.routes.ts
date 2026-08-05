import express from "express";

import protect from "@/middleware/protect";

import {
    getMyReferralsController,
} from "@/controllers/referral.controller";

const router = express.Router();

router.get(
    "/",
    protect,
    getMyReferralsController
);

export default router;