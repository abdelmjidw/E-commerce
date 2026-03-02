import express from "express";
import prisma from "../config/db.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({ where: { deleted: false } });
  res.json(categories);
});

router.post("/", protect, adminOnly, async (req, res) => {
  const { name, description } = req.body;
  const category = await prisma.category.create({ data: { name, description } });
  res.status(201).json(category);
});

export default router;