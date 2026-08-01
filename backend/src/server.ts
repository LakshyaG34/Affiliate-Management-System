import express from "express";
import prisma from "@/lib/prisma";

const app = express();

app.use(express.json());

app.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});