// src/routes/users.ts
import express, { Request, Response } from "express";
import { getMongoClient } from "../db/mongoClinet";
import { DB_NAME } from "../constants/server";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const client = getMongoClient();
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

export default router;
