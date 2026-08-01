import express from "express";
import authRoutes from "@/routes/auth.routes";
import notFoundMiddleware from "@/middleware/notFound.middleware";
import errorMiddleware from "@/middleware/error.middleware";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});