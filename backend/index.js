import app from "./app.js";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
app.use(express.json());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
