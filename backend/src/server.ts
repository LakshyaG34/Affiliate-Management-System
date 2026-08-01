import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Affiliate Management API");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});