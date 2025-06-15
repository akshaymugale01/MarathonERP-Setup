// src/server.ts
import express from "express";
import { PORT } from "./constants/server";
import usersMongo from "./services/usersMongo";
const app = express();

app.use(express.json());
app.use("/api/users", usersMongo);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
