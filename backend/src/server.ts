import express from "express";
import authRoutes from "@/routes/auth.routes";
import purchaseRoutes from "@/routes/purchase.routes";

import notFoundMiddleware from "@/middleware/notFound.middleware";
import errorMiddleware from "@/middleware/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminRoutes from "@/routes/admin.routes";
import commissionRoutes from "./routes/commission.routes";
import payoutRoutes from "./routes/payout.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/payouts", payoutRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});